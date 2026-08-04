import { Router } from 'express'
import { authenticate } from '../../middlewares/authenticate'
import { destroy, index, show, store, update } from './reservas.controller'

export const reservasRoutes = Router()

reservasRoutes.use(authenticate)

reservasRoutes.get('/', index)
reservasRoutes.get('/:id', show)
reservasRoutes.post('/', store)
reservasRoutes.put('/:id', update)
reservasRoutes.delete('/:id', destroy)
