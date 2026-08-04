import { z } from 'zod'

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário deve estar no formato HH:mm')

export const createReservaSchema = z.object({
  salaId: z.string().uuid(),
  data: dateSchema,
  horarioInicio: timeSchema,
  horarioFim: timeSchema,
  // Só um admin consegue reservar em nome de outro usuário — validado no
  // service, não aqui no schema.
  usuarioId: z.string().uuid().optional(),
})

export const updateReservaSchema = z.object({
  data: dateSchema.optional(),
  horarioInicio: timeSchema.optional(),
  horarioFim: timeSchema.optional(),
})

export const listReservasQuerySchema = z.object({
  salaId: z.string().uuid().optional(),
  usuarioId: z.string().uuid().optional(),
  data: dateSchema.optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
})

export type CreateReservaInput = z.infer<typeof createReservaSchema>
export type UpdateReservaInput = z.infer<typeof updateReservaSchema>
export type ListReservasQuery = z.infer<typeof listReservasQuerySchema>
