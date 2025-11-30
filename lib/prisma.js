import { PrismaClient } from './generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis

// Create PostgreSQL connection pool (singleton)
let pool
let adapter

if (!globalForPrisma.pgPool) {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  globalForPrisma.pgPool = new Pool({ connectionString })
  globalForPrisma.prismaAdapter = new PrismaPg(globalForPrisma.pgPool)
}

pool = globalForPrisma.pgPool
adapter = globalForPrisma.prismaAdapter

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

