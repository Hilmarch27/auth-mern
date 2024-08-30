import figlet from 'figlet'
import { app } from './application/app'
import { logger } from './application/logger'

const port = process.env.PORT ?? 5000

app.listen(port, () => {
  logger.info(figlet.textSync('Man', { horizontalLayout: 'full' }))
  logger.info(`Server is running on port ${port}`)
})
