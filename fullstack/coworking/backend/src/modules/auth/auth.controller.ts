import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { loginSchema, registerSchema } from './auth.schemas'
import { loginUser, registerUser } from './auth.service'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body)
  const result = await registerUser(input)
  return res.status(201).json(result)
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body)
  const result = await loginUser(input)
  return res.status(200).json(result)
})
