import { Router } from 'express'
import { authenticate } from '../../middlewares/authenticate'
import { requireAdmin, requireSelfOrAdmin } from '../../middlewares/authorize'
import { destroy, index, show, store, update } from './usuarios.controller'

export const usuariosRoutes = Router()

usuariosRoutes.use(authenticate)

// Só admin lista todos ou cria usuário manualmente (fora do /auth/register)
usuariosRoutes.get('/', requireAdmin, index)
usuariosRoutes.post('/', requireAdmin, store)

// Cada usuário pode ver/editar/apagar a própria conta; admin acessa qualquer uma
usuariosRoutes.get('/:id', requireSelfOrAdmin(), show)
usuariosRoutes.put('/:id', requireSelfOrAdmin(), update)
usuariosRoutes.delete('/:id', requireSelfOrAdmin(), destroy)
