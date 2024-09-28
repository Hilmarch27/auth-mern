import cron from 'node-cron'
import { AuthService } from '../services/auth.service'
// Schedule to run cleanup every day at midnight
cron.schedule('0 17 * * *', async () => {
  console.log('Running scheduled task: Cleaning up expired tokens')
  await AuthService.cleanUpExpiredTokens()
})
