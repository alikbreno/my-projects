import { PrismaClient } from '@prisma/client'

// Uma única instância do client em toda a aplicação.
export const prisma = new PrismaClient()
