import { NextFunction, Request, Response } from 'express'
import { CreateUserRequest, LoginUserRequest } from '../models/user.model'
import { AuthService } from '../services/auth.service'
import { RequestWithCookies } from '../types/cookies.request'

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
        maxAge: 4 * 60 * 1000 // 4 minutes (or match the JWT expiration)
      })

      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
      })

      res.status(200).json({
        data: { name: response.name, email: response.email }
      })
    } catch (e) {
      next(e)
    }
  }

  static async refresh(req: RequestWithCookies, res: Response, next: NextFunction) {
    try {
      const response = await AuthService.refresh(req)

      res.cookie('accessToken', response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })

      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
      })

      res.status(200).json({
        data: { name: response.name, email: response.email }
      })
    } catch (e) {
      next(e)
    }
  }
}
