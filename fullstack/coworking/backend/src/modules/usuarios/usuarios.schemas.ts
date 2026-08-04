import { z } from 'zod'

export const createUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto.'),
  email: z.string().email('E-mail inválido.'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
  telefone: z.string().optional(),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos numéricos.'),
  // Sem .default() aqui de propósito: se não vier no body, o campo fica
  // undefined e o Prisma aplica o @default(false) do schema.prisma. Um
  // .default() aqui vazaria pro updateUsuarioSchema (via .partial()) e
  // resetaria eAdmin pra false em qualquer update que não o incluísse.
  eAdmin: z.boolean().optional(),
})

export const updateUsuarioSchema = createUsuarioSchema
  .partial()
  .omit({ senha: true })
  .extend({
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.').optional(),
  })

export const listUsuariosQuerySchema = z.object({
  search: z.string().optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
})

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>
export type ListUsuariosQuery = z.infer<typeof listUsuariosQuerySchema>
