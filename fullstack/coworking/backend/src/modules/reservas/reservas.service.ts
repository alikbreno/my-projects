import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../utils/AppError'
import { DEFAULT_PAGE_SIZE } from '../../utils/pagination'
import {
  combineDateAndTime,
  hasMinimumAdvance,
  isPastDate,
  isValidTimeRange,
  toDateOnly,
} from '../../utils/date'
import {
  CreateReservaInput,
  ListReservasQuery,
  UpdateReservaInput,
} from './reservas.schemas'

type RequestContext = { usuarioId: string; eAdmin: boolean }

async function assertSalaExiste(salaId: string) {
  const sala = await prisma.sala.findUnique({ where: { id: salaId } })
  if (!sala) throw new AppError('Sala não encontrada.', 404)
}

// Duas reservas [aInicio, aFim) e [bInicio, bFim) se sobrepõem quando
// aInicio < bFim E aFim > bInicio.
async function assertSemConflito(
  salaId: string,
  data: Date,
  horarioInicio: string,
  horarioFim: string,
  ignorarReservaId?: string
) {
  const conflito = await prisma.reserva.findFirst({
    where: {
      salaId,
      data,
      id: ignorarReservaId ? { not: ignorarReservaId } : undefined,
      horarioInicio: { lt: horarioFim },
      horarioFim: { gt: horarioInicio },
    },
  })

  if (conflito) {
    throw new AppError(
      'Já existe uma reserva para essa sala nesse dia e horário.',
      409
    )
  }
}

// Valida as regras de negócio comuns a criação e edição de reservas:
// intervalo de horário válido, data não pode ser passada, e precisa de
// pelo menos 1h de antecedência até o início da reserva.
function validarJanelaDeTempo(
  dataStr: string,
  horarioInicio: string,
  horarioFim: string
) {
  if (!isValidTimeRange(horarioInicio, horarioFim)) {
    throw new AppError('O horário de início deve ser antes do horário de fim.', 400)
  }

  const data = toDateOnly(dataStr)

  if (isPastDate(data)) {
    throw new AppError('Não é possível reservar uma data que já passou.', 400)
  }

  const inicioCompleto = combineDateAndTime(data, horarioInicio)

  if (!hasMinimumAdvance(inicioCompleto)) {
    throw new AppError(
      'Reservas só podem ser feitas com no mínimo 1 hora de antecedência.',
      400
    )
  }

  return data
}

export async function listReservas(query: ListReservasQuery, ctx: RequestContext) {
  const limit = query.limit ?? DEFAULT_PAGE_SIZE

  const where: Prisma.ReservaWhereInput = {
    // Usuário comum só vê as próprias reservas; admin vê tudo (ou filtra
    // por usuarioId específico, se enviado).
    usuarioId: ctx.eAdmin ? query.usuarioId : ctx.usuarioId,
    salaId: query.salaId,
    data: query.data ? toDateOnly(query.data) : undefined,
  }

  const [reservas, total] = await Promise.all([prisma.reserva.findMany({
    where,
    orderBy: [{ data: 'asc' }, { horarioInicio: 'asc' }],
    take: limit + 1,
    ...(query.cursor && { skip: 1, cursor: { id: query.cursor } }),
    include: { sala: true, usuario: { select: { id: true, nome: true, email: true } } },
  }), prisma.reserva.count({ where })])

  const hasNextPage = reservas.length > limit
  const items = hasNextPage ? reservas.slice(0, limit) : reservas

  return {
    total,
    reservas: items.map((reserva) => ({
      ...reserva,
      sala: {
        ...reserva.sala,
        precoLocacao: Number(reserva.sala.precoLocacao),
      },
      usuario: reserva.usuario,
    })),
    nextCursor: hasNextPage ? items[items.length - 1].id : null,
  }
}

async function getReservaOuFalha(id: string) {
  const reserva = await prisma.reserva.findUnique({ where: { id } })
  if (!reserva) throw new AppError('Reserva não encontrada.', 404)
  return reserva
}

function assertPodeAcessar(reserva: { usuarioId: string }, ctx: RequestContext) {
  if (!ctx.eAdmin && reserva.usuarioId !== ctx.usuarioId) {
    throw new AppError('Você não tem permissão para acessar essa reserva.', 403)
  }
}

export async function getReservaById(id: string, ctx: RequestContext) {
  const reserva = await getReservaOuFalha(id)
  assertPodeAcessar(reserva, ctx)
  return reserva
}

export async function createReserva(input: CreateReservaInput, ctx: RequestContext) {
  const usuarioId = ctx.eAdmin && input.usuarioId ? input.usuarioId : ctx.usuarioId

  await assertSalaExiste(input.salaId)

  const data = validarJanelaDeTempo(input.data, input.horarioInicio, input.horarioFim)

  await assertSemConflito(input.salaId, data, input.horarioInicio, input.horarioFim)

  return prisma.reserva.create({
    data: {
      data,
      horarioInicio: input.horarioInicio,
      horarioFim: input.horarioFim,
      salaId: input.salaId,
      usuarioId,
    },
  })
}

export async function updateReserva(
  id: string,
  input: UpdateReservaInput,
  ctx: RequestContext
) {
  const reservaAtual = await getReservaOuFalha(id)
  assertPodeAcessar(reservaAtual, ctx)

  // A reserva ATUAL só pode ser alterada se ainda faltar >= 1h pro início
  // dela (regra vale tanto pro horário antigo quanto pro novo).
  const inicioAtual = combineDateAndTime(reservaAtual.data, reservaAtual.horarioInicio)
  if (!hasMinimumAdvance(inicioAtual)) {
    throw new AppError(
      'Reservas só podem ser alteradas com no mínimo 1 hora de antecedência.',
      400
    )
  }

  const dataStr = input.data ?? reservaAtual.data.toISOString().slice(0, 10)
  const horarioInicio = input.horarioInicio ?? reservaAtual.horarioInicio
  const horarioFim = input.horarioFim ?? reservaAtual.horarioFim

  const data = validarJanelaDeTempo(dataStr, horarioInicio, horarioFim)

  await assertSemConflito(reservaAtual.salaId, data, horarioInicio, horarioFim, id)

  return prisma.reserva.update({
    where: { id },
    data: { data, horarioInicio, horarioFim },
  })
}

export async function cancelReserva(id: string, ctx: RequestContext) {
  const reserva = await getReservaOuFalha(id)
  assertPodeAcessar(reserva, ctx)

  const inicio = combineDateAndTime(reserva.data, reserva.horarioInicio)
  if (!hasMinimumAdvance(inicio)) {
    throw new AppError(
      'Reservas só podem ser canceladas com no mínimo 1 hora de antecedência.',
      400
    )
  }

  await prisma.reserva.delete({ where: { id } })
}
