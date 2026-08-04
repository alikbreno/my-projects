import { NextFunction, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError'

// Precisa dos 4 parâmetros pro Express reconhecer como error handler,
// mesmo sem usar next diretamente.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Dados inválidos.',
      details: err.flatten().fieldErrors,
    })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        message: 'Já existe um registro com esses dados.',
        details: err.meta,
      })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Registro não encontrado.' })
    }
  }

  console.error(err)
  return res.status(500).json({ message: 'Erro interno do servidor.' })
}
