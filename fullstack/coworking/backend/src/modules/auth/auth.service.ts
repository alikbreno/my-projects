import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
import { env } from '../../config/env'
import { AppError } from '../../utils/AppError'
import { toPublicUser } from '../usuarios/usuarios.service'
import { LoginInput, RegisterInput } from './auth.schemas'

const SALT_ROUNDS = 10

function generateToken(usuarioId: string, eAdmin: boolean) {
  // env.JWT_EXPIRES_IN é `string` (validado só como não-vazio pelo zod),
  // mas o @types/jsonwebtoken espera um literal mais específico
  // (ex: "1h", "7d") ou number — daí a asserção de tipo explícita aqui.
  const options: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  }
  return jwt.sign({ sub: usuarioId, eAdmin }, env.JWT_SECRET, options)
}

export async function registerUser(input: RegisterInput) {
  const senhaHash = await bcrypt.hash(input.senha, SALT_ROUNDS)

  const usuario = await prisma.usuario.create({
    data: { ...input, senha: senhaHash },
  })

  const accessToken = generateToken(usuario.id, usuario.eAdmin)

  return { accessToken, usuario: toPublicUser(usuario) }
}

export async function loginUser(input: LoginInput) {
  const usuario = await prisma.usuario.findUnique({
    where: { email: input.email },
  })

  if (!usuario) {
    throw new AppError('E-mail ou senha inválidos.', 401)
  }

  const senhaValida = await bcrypt.compare(input.senha, usuario.senha)

  if (!senhaValida) {
    throw new AppError('E-mail ou senha inválidos.', 401)
  }

  const accessToken = generateToken(usuario.id, usuario.eAdmin)

  return { accessToken, usuario: toPublicUser(usuario) }
}
