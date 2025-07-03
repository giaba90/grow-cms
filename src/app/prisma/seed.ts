import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const plainPassword = 'password123'
    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            id: 'user-1',
            name: 'Demo User',
            email: 'demo@example.com',
            emailVerified: false,
            password: hashedPassword,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })

    console.log(`✅ Utente creato:
  Email: ${user.email}
  Password: ${plainPassword}
  ID: ${user.id}`)
}

main()
    .catch(e => {
        console.error('❌ Errore nel seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
