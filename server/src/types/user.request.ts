import { User } from '@prisma/client'
import { Request } from 'express'

// if you want add user to request use this
export interface UserRequest extends Request {
  user?: User
}
