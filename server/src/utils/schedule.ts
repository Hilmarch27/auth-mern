import cron from 'node-cron'
import { AuthService } from '../services/auth.service'
import { logger } from '../application/logger'
// Schedule to run cleanup every day at midnight
cron.schedule('0 17 * * *', async () => {
  logger.info('Running scheduled task: Cleaning up expired tokens')
  await AuthService.cleanUpExpiredTokens()
})
