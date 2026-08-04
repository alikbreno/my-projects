import bcrypt from 'bcryptjs'
import { Usuario } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../utils/AppError'
import { DEFAULT_PAGE_SIZE } from '../../utils/pagination'
import {
  CreateUsuarioInput,
  ListUsuariosQuery,
  UpdateUsuarioInput,
} from './usuarios.schemas'

const SALT_ROUNDS = 10

// Nunca devolver o hash da senha pro client.
export function toPublicUser(usuario: Usuario) {
  const { senha, ...publicUser } = usuario
  return publicUser
}

export async function listUsuarios(query: ListUsuariosQuery) {
  const limit = query.limit ?? DEFAULT_PAGE_SIZE

  const where = query.search
    ? { nome: { contains: query.search, mode: 'insensitive' as const } }
    : undefined

  const [usuarios, total] = await Promise.all([prisma.usuario.findMany({
    where,
    orderBy: { nome: 'asc' },
    take: limit + 1,
    ...(query.cursor && { skip: 1, cursor: { id: query.cursor } }),
  }), prisma.usuario.count({ where })])

  const hasNextPage = usuarios.length > limit
  const items = hasNextPage ? usuarios.slice(0, limit) : usuarios

  return {
    total,
    usuarios: items.map(toPublicUser),
    nextCursor: hasNextPage ? items[items.length - 1].id : null,
  }
}

export async function getUsuarioById(id: string) {
  const usuario = await prisma.usuario.findUnique({ where: { id } })
  if (!usuario) throw new AppError('Usuário não encontrado.', 404)
  return toPublicUser(usuario)
}

export async function createUsuario(input: CreateUsuarioInput) {
  const senhaHash = await bcrypt.hash(input.senha, SALT_ROUNDS)
  const usuario = await prisma.usuario.create({
    data: { ...input, senha: senhaHash },
  })
  return toPublicUser(usuario)
}

export async function updateUsuario(id: string, input: UpdateUsuarioInput) {
  const { senha, ...rest } = input
  const senhaHash = senha ? await bcrypt.hash(senha, SALT_ROUNDS) : undefined

  const usuario = await prisma.usuario
    .update({
      where: { id },
      data: {
        ...rest,
        ...(senhaHash ? { senha: senhaHash } : {}),
      },
    })
    .catch(() => {
      throw new AppError('Usuário não encontrado.', 404)
    })

  return toPublicUser(usuario)
}

export async function deleteUsuario(id: string) {
  await prisma.usuario.delete({ where: { id } }).catch(() => {
    throw new AppError('Usuário não encontrado.', 404)
  })
}
