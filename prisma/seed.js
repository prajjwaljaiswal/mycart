const { PrismaClient } = require('../lib/generated/prisma/client.ts')
const bcrypt = require('bcryptjs')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
require('dotenv/config')

// Create Prisma client with adapter for seeding
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('🌱 Seeding admin user...')

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gocart.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const adminName = process.env.ADMIN_NAME || 'Admin User'

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('ℹ️  Admin user already exists, skipping...')
    return
  }

  // Create admin user
  await prisma.admin.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName
    }
  })

  console.log('✅ Admin user created successfully!')
  console.log(`📧 Email: ${adminEmail}`)
  console.log(`🔑 Password: ${adminPassword}`)
  console.log('⚠️  Please change the default password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
