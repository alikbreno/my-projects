import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../utils/AppError'
import { DEFAULT_PAGE_SIZE } from '../../utils/pagination'
import { toDateOnly, todayDateOnly } from '../../utils/date'
import { CreateSalaInput, ListSalasQuery, UpdateSalaInput } from './salas.schemas'

// Decimal do Prisma não serializa bem em JSON puro — converte pra number
// na borda (service -> controller), sem carregar Decimal pro resto do app.
function serializeSala<T extends { precoLocacao: Prisma.Decimal }>(sala: T) {
  return { ...sala, precoLocacao: Number(sala.precoLocacao) }
}

export async function listSalas(query: ListSalasQuery) {
  const limit = query.limit ?? DEFAULT_PAGE_SIZE
  const referenceDate = query.date ? toDateOnly(query.date) : todayDateOnly()

  const where: Prisma.SalaWhereInput = {
    ...(query.search && {
      nome: { contains: query.search, mode: 'insensitive' },
    }),
    // Filtro de disponibilidade: só traz salas que NÃO têm reserva
    // cobrindo a data/horário informado.
    ...(query.date &&
      query.time && {
        reservas: {
          none: {
            data: referenceDate,
            horarioInicio: { lte: query.time },
            horarioFim: { gt: query.time },
          },
        },
      }),
  }

  const [salas, total] = await Promise.all([prisma.sala.findMany({
    where,
    orderBy: { nome: 'asc' },
    take: limit + 1,
    ...(query.cursor && { skip: 1, cursor: { id: query.cursor } }),
    include: {
      // Reservas do dia de referência, pra alimentar o relógio de
      // disponibilidade no card (verde/vermelho) no front.
      reservas: {
        where: { data: referenceDate },
        select: { horarioInicio: true, horarioFim: true },
        orderBy: { horarioInicio: 'asc' },
      },
    },
  }), prisma.sala.count({ where })])

  const hasNextPage = salas.length > limit
  const items = hasNextPage ? salas.slice(0, limit) : salas

  return {
    total,
    salas: items.map(({ reservas, ...sala }) => ({
      ...serializeSala(sala),
      busySlots: reservas,
    })),
    nextCursor: hasNextPage ? items[items.length - 1].id : null,
  }
}

export async function getSalaById(id: string, date?: string) {
  const referenceDate = date ? toDateOnly(date) : todayDateOnly()

  const sala = await prisma.sala.findUnique({
    where: { id },
    include: {
      reservas: {
        where: { data: referenceDate },
        select: { horarioInicio: true, horarioFim: true },
        orderBy: { horarioInicio: 'asc' },
      },
    },
  })

  if (!sala) throw new AppError('Sala não encontrada.', 404)

  const { reservas, ...rest } = sala
  return { ...serializeSala(rest), busySlots: reservas }
}

export async function createSala(input: CreateSalaInput) {
  const sala = await prisma.sala.create({ data: input })
  return serializeSala(sala)
}

export async function updateSala(id: string, input: UpdateSalaInput) {
  const sala = await prisma.sala.update({ where: { id }, data: input }).catch(() => {
    throw new AppError('Sala não encontrada.', 404)
  })
  return serializeSala(sala)
}

export async function deleteSala(id: string) {
  await prisma.sala.delete({ where: { id } }).catch(() => {
    throw new AppError('Sala não encontrada.', 404)
  })
}
