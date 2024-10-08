import { Request, Response, NextFunction } from 'express'
import { logger } from '../application/logger'
import { decryptSignature } from '../utils/aes-256'

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  logger.info('is user')
  if (!user) {
    return res.sendStatus(401)
  }
  return next()
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  logger.info('is admin')
  if (!user || user.role !== 'admin') {
    return res.sendStatus(401)
  }
  return next()
}

export const requireSignature = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.cookies.signature
  console.info(signature)
  if (!signature) {
    return next()
  }
  // Ketika menerima signature dari client, lakukan dekripsi dan pengecekan waktu expired
  const decryptedSignature = decryptSignature(signature)
  if (decryptedSignature) {
    // Signature valid, proses dengan userId
    console.info('User ID:', decryptedSignature.userId)
    console.info('Expires At:', decryptedSignature.expiresAt)
    res.locals.signature = decryptedSignature.userId
  } else {
    // Signature invalid atau sudah kedaluwarsa
    logger.error('Signature invalid atau expired')
    return res.sendStatus(401)
  }
  return next()
}
