import { Router } from 'express'
import { authenticate } from '../../middlewares/authenticate'
import { requireAdmin } from '../../middlewares/authorize'
import { destroy, index, show, store, update } from './salas.controller'

export const salasRoutes = Router()

salasRoutes.use(authenticate)

salasRoutes.get('/', index)
salasRoutes.get('/:id', show)

// Só admin gerencia o catálogo de salas
salasRoutes.post('/', requireAdmin, store)
salasRoutes.put('/:id', requireAdmin, update)
salasRoutes.delete('/:id', requireAdmin, destroy)
