import { z } from 'zod'

export const registerSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto.'),
  email: z.string().email('E-mail inválido.'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
  telefone: z.string().optional(),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos numéricos.'),
})

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  senha: z.string().min(1, 'Senha é obrigatória.'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
