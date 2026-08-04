import { z } from 'zod'

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário deve estar no formato HH:mm')

export const createSalaSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto.'),
  capacidade: z.coerce.number().int().positive('Capacidade deve ser maior que zero.'),
  descricao: z.string().optional(),
  precoLocacao: z.coerce.number().nonnegative('Preço não pode ser negativo.'),
})

export const updateSalaSchema = createSalaSchema.partial()

export const listSalasQuerySchema = z.object({
  search: z.string().optional(),
  date: dateSchema.optional(),
  time: timeSchema.optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
})

export type CreateSalaInput = z.infer<typeof createSalaSchema>
export type UpdateSalaInput = z.infer<typeof updateSalaSchema>
export type ListSalasQuery = z.infer<typeof listSalasQuerySchema>
