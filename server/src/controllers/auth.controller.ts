import { NextFunction, Request, Response } from 'express'
import { CreateUserRequest, LoginUserRequest, RefreshTokenRequest } from '../models/user.model'
import { AuthService } from '../services/auth.service'
import { logger } from '../application/logger'

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      //? body req
      const request: CreateUserRequest = req.body as CreateUserRequest
      //? send to service
      const response = await AuthService.register(request)
      //? send to client
      res.status(200).json({
        data: response
      })
    } catch (e) {
      next(e)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginUserRequest = req.body as LoginUserRequest
      const response = await AuthService.login(request)

      // Set the access and refresh tokens as HTTP-only cookies
      res.cookie('accessToken', response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000 // 30 minutes
      })

      res.cookie('signature', response.signature, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict',
        maxAge: 8 * 24 * 60 * 60 * 1000 // 8 days
      })

      res.status(200).json({
        data: { name: response.name, email: response.email }
      })
    } catch (e) {
      next(e)
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.signature
      logger.info(userId)

      if (!userId) {
        return res.sendStatus(401) // Unauthorized
      }

      // Call the AuthService to handle the refresh logic
      const response = await AuthService.refresh(userId)

      // Set the new access token as a cookie (or send it in the response body if preferred)
      res.cookie('accessToken', response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set true in production
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000 // 30 minutes
      })

      // Send back the user ID and access token to the client
      res.status(200).json({
        data: {
          userId: response.userId,
          revoked: response.revoked
        }
      })
    } catch (e) {
      next(e)
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const request: RefreshTokenRequest = req.body as RefreshTokenRequest
      // Clear cookies (optional: depending on your app)
      res.clearCookie('accessToken')

      const response = await AuthService.logout(request)
      res.status(200).json({ data: response })
    } catch (e) {
      next(e)
    }
  }
}
