import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import {
  createSalaSchema,
  listSalasQuerySchema,
  updateSalaSchema,
} from './salas.schemas'
import {
  createSala,
  deleteSala,
  getSalaById,
  listSalas,
  updateSala,
} from './salas.service'

export const index = asyncHandler(async (req: Request, res: Response) => {
  const query = listSalasQuerySchema.parse(req.query)
  const result = await listSalas(query)
  return res.json(result)
})

export const show = asyncHandler(async (req: Request, res: Response) => {
  const date = typeof req.query.date === 'string' ? req.query.date : undefined
  const sala = await getSalaById(req.params.id, date)
  return res.json(sala)
})

export const store = asyncHandler(async (req: Request, res: Response) => {
  const input = createSalaSchema.parse(req.body)
  const sala = await createSala(input)
  return res.status(201).json(sala)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const input = updateSalaSchema.parse(req.body)
  const sala = await updateSala(req.params.id, input)
  return res.json(sala)
})

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await deleteSala(req.params.id)
  return res.status(204).send()
})
