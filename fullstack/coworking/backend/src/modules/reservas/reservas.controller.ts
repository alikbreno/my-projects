import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import {
  createReservaSchema,
  listReservasQuerySchema,
  updateReservaSchema,
} from './reservas.schemas'
import {
  cancelReserva,
  createReserva,
  getReservaById,
  listReservas,
  updateReserva,
} from './reservas.service'

function getCtx(req: Request) {
  return { usuarioId: req.user!.sub, eAdmin: req.user!.eAdmin }
}

export const index = asyncHandler(async (req: Request, res: Response) => {
  const query = listReservasQuerySchema.parse(req.query)
  const result = await listReservas(query, getCtx(req))
  return res.json(result)
})

export const show = asyncHandler(async (req: Request, res: Response) => {
  const reserva = await getReservaById(req.params.id, getCtx(req))
  return res.json(reserva)
})

export const store = asyncHandler(async (req: Request, res: Response) => {
  const input = createReservaSchema.parse(req.body)
  const reserva = await createReserva(input, getCtx(req))
  return res.status(201).json(reserva)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const input = updateReservaSchema.parse(req.body)
  const reserva = await updateReserva(req.params.id, input, getCtx(req))
  return res.json(reserva)
})

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await cancelReserva(req.params.id, getCtx(req))
  return res.status(204).send()
})
