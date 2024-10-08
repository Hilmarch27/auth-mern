import dotenv from 'dotenv'
import crypto from 'crypto'
import { logger } from '../application/logger'

dotenv.config()

const { SECRET_KEY, SECRET_IV, ECNRYPTION_METHOD } = process.env

if (!SECRET_KEY || !SECRET_IV || !ECNRYPTION_METHOD) {
  throw new Error('SECRET_KEY , SECRET_IV, and ECNRYPTION_METHOD are required')
} else {
  logger.info('AES configuration found: using encryption method', ECNRYPTION_METHOD)
}

// Generate secret hash with crypto to use for encryption
const key: string = crypto.createHash('sha512').update(SECRET_KEY).digest('hex').substring(0, 32)
const encryptionIV: string = crypto.createHash('sha512').update(SECRET_IV).digest('hex').substring(0, 16)

logger.info('The key and IV for encryption have been successfully generated.')

// Encrypt data
export function encryptData(data: string): string {
  const cipher = crypto.createCipheriv(ECNRYPTION_METHOD as crypto.CipherCCMTypes, key, encryptionIV)
  const encryptedData = Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64')
  logger.info('The data has been encrypted.')
  return encryptedData
}

// Decrypt data
export function decryptData(encryptedData: string): string {
  const buff = Buffer.from(encryptedData, 'base64')
  const decipher = crypto.createDecipheriv(ECNRYPTION_METHOD as crypto.CipherCCMTypes, key, encryptionIV)
  const decryptedData = decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8')
  logger.info('The data has been decrypted.')
  return decryptedData
}

// Decrypt signature
export function decryptSignature(signature: string): { userId: string, expiresAt: number } | null {
  try {
    const decryptedData = decryptData(signature)
    const parsedData = JSON.parse(decryptedData)

    // Check if the token is expired
    if (parsedData.expiresAt < Math.floor(Date.now() / 1000)) {
      logger.warn('Signature has expired.')
      return null // Signature has expired
    }

    logger.info('Signature valid.')
    return parsedData // Signature valid, return the parsed data
  } catch (error) {
    logger.error('Failed to decrypt signature:', error)
    return null // Invalid signature
  }
}
