import { NextFunction, Response } from 'express'
import { UserService } from '../services/user.service'
import { UserRequest } from '../types/user.request'
import { ResponseError } from '../error/reponse.error'

export class UserController {
  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user
      console.log('UserController ~ user:', user)

      if (!user) {
        throw new ResponseError(404, 'User Not Found')
      }

      const response = await UserService.get(user)
      res.status(200).json({
        data: response
      })
    } catch (e) {
      next(e)
    }
  }
}
