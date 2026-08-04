import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório.'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório.'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
