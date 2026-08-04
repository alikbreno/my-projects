import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const senhaHash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@coworking.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@coworking.com',
      senha: senhaHash,
      cpf: '00000000000',
      eAdmin: true,
    },
  })

  await prisma.sala.createMany({
    data: [
      {
        nome: 'Sala Ipê',
        capacidade: 6,
        descricao: 'Sala de reunião com TV e quadro branco.',
        precoLocacao: 80,
      },
      {
        nome: 'Sala Jacarandá',
        capacidade: 10,
        descricao: 'Sala ampla para workshops e treinamentos.',
        precoLocacao: 150,
      },
      {
        nome: 'Sala Cedro',
        capacidade: 2,
        descricao: 'Sala individual para chamadas e trabalho focado.',
        precoLocacao: 30,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Seed concluído. Admin:', admin.email, '(senha: admin123)')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
