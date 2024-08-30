import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'error'
    },
    {
      emit: 'event',
      level: 'info'
    },
    {
      emit: 'event',
      level: 'warn'
    }
  ]
})

prismaClient.$on('error', (e: unknown) => {
  logger.error(e)
})

prismaClient.$on('warn', (e: unknown) => {
  logger.warn(e)
})

prismaClient.$on('info', (e: unknown) => {
  logger.info(e)
})

prismaClient.$on('query', (e: any) => {
  const formattedQuery = e.query
    .replace(/SELECT/g, '\n  SELECT')
    .replace(/FROM/g, '\n  FROM')
    .replace(/WHERE/g, '\n  WHERE')
    .replace(/LIMIT/g, '\n  LIMIT')
    .replace(/OFFSET/g, '\n  OFFSET')

  const formattedLog = `
  {
    "timestamp": "${new Date().toISOString()}",
    "query": "${formattedQuery}",
    "params": ${e.params},
    "duration": ${e.duration},
    "target": "${e.target}"
  }`.trim()

  logger.info(formattedLog)
})
