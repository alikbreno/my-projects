import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from '../utils/AppError'

export type AuthPayload = {
  sub: string
  eAdmin: boolean
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Token de autenticação não informado.', 401)
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload
    req.user = payload
    next()
  } catch {
    throw new AppError('Token inválido ou expirado.', 401)
  }
}
