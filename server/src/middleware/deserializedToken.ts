import { Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../utils/jwt'

const deserializeToken = async (req: Request, res: Response, next: NextFunction) => {
  // Ambil accessToken dari cookies
  const accessToken = req.cookies.accessToken
  console.log('accessToken:', accessToken)

  if (!accessToken) {
    return next()
  }

  const token: any = verifyJWT(accessToken)
  if (token.decoded) {
    res.locals.user = token.decoded
    return next()
  }

  if (token.expired) {
    return next()
  }

  return next()
}

export default deserializeToken
