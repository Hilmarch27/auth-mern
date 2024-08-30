import { User } from '@prisma/client'
import { toUserResponse, UserResponse } from '../models/user.model'

export class UserService {
  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user)
  }
}
