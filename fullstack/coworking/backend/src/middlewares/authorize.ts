import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/AppError'

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user?.eAdmin) {
    throw new AppError('Apenas administradores podem realizar essa ação.', 403)
  }
  next()
}

// Libera acesso se for admin OU se o :id da rota for o próprio usuário
// autenticado (ex: usuário editando o próprio perfil).
export function requireSelfOrAdmin(paramName = 'id') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const targetId = req.params[paramName]
    if (req.user?.eAdmin || req.user?.sub === targetId) {
      return next()
    }
    throw new AppError('Você não tem permissão para acessar esse recurso.', 403)
  }
}
