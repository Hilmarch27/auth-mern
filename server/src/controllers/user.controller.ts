import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { ResponseError } from '../error/reponse.error'
import { TokenResponse } from '../models/user.model'

export class UserController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user as TokenResponse

      if (!user) {
        throw new ResponseError(404, 'User Not Found')
      }

      const response = await UserService.get(user.userId)
      res.status(200).json({
        data: response
      })
    } catch (e) {
      next(e)
    }
  }
}
