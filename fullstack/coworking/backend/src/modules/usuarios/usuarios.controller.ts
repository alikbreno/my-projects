import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import {
  createUsuarioSchema,
  listUsuariosQuerySchema,
  updateUsuarioSchema,
} from './usuarios.schemas'
import {
  createUsuario,
  deleteUsuario,
  getUsuarioById,
  listUsuarios,
  updateUsuario,
} from './usuarios.service'

export const index = asyncHandler(async (req: Request, res: Response) => {
  const query = listUsuariosQuerySchema.parse(req.query)
  const result = await listUsuarios(query)
  return res.json(result)
})

export const show = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await getUsuarioById(req.params.id)
  return res.json(usuario)
})

export const store = asyncHandler(async (req: Request, res: Response) => {
  const input = createUsuarioSchema.parse(req.body)
  const usuario = await createUsuario(input)
  return res.status(201).json(usuario)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const input = updateUsuarioSchema.parse(req.body)

  // Só um admin pode conceder/revogar privilégio de admin de alguém —
  // mesmo que o próprio usuário esteja editando o próprio perfil.
  if (!req.user?.eAdmin) {
    delete input.eAdmin
  }

  const usuario = await updateUsuario(req.params.id, input)
  return res.json(usuario)
})

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await deleteUsuario(req.params.id)
  return res.status(204).send()
})
