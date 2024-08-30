import { Router, Request, Response, NextFunction } from 'express'
import { logger } from '../application/logger'

export const HealthRouter: Router = Router()

//check if server is running
HealthRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('success')
  res.status(200).send('Hello Hilman king ts')
})
