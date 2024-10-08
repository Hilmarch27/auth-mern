import { Router, Request, Response, NextFunction } from 'express'
import { logger } from '../application/logger'
import UAParser from 'ua-parser-js'

export const HealthRouter: Router = Router()

//check if server is running
HealthRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const uaParser = new UAParser()
  const userAgent = req.headers['user-agent'] ?? ''
  const deviceInfo = uaParser.setUA(userAgent).getResult()
  logger.info(deviceInfo.browser.name)

  // Send the response once
  res.status(200).json({
    ip: req.ip,
    deviceInfo,
    message: 'success server is running'
  })
})
