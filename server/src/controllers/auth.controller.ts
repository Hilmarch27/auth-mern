import { NextFunction, Request, Response } from 'express'
import { CreateUserRequest, LoginUserRequest, RefreshTokenRequest } from '../models/user.model'
import { AuthService } from '../services/auth.service'

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
        maxAge: 15 * 60 * 1000 // 15 minutes (matching the JWT expiration)
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
      // Extract the refresh token from the request body
      const request: RefreshTokenRequest = req.body as RefreshTokenRequest

      // Call the AuthService to handle the refresh logic
      const response = await AuthService.refresh(request)

      // Set the new access token as a cookie (or send it in the response body if preferred)
      res.cookie('accessToken', response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set true in production
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes, or match the JWT expiration
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
