import { Validation } from '../validations/validation'
import { UserValidation } from '../validations/auth.validation'
import { prismaClient } from '../application/database'
import { ResponseError } from '../error/reponse.error'
import { UserResponse } from '../models/user.model'

export class UserService {
  static async get(userId: string): Promise<UserResponse> {
    const id = Validation.validate(UserValidation.USER_ID, userId)

    const user = await prismaClient.user.findUnique({
      where: {
        id
      },
      include: {
        refreshTokens: true // Include refresh tokens in the response
      }
    })

    if (!user) {
      throw new ResponseError(404, 'User not found')
    }

    // Filter refresh tokens yang belum dicabut (revoked === false)
    const validToken = user.refreshTokens.find((token) => !token.revoked)

    // Kembalikan response user
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      token: validToken ? validToken.token : undefined // Hanya kembalikan token yang valid
    }
  }
}
