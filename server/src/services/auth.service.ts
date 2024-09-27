import { Validation } from '../validations/validation'
import { CreateUserRequest, LoginUserRequest, NewTokenResponse, toUserResponse, UserResponse } from '../models/user.model'
import { UserValidation } from '../validations/auth.validation'
import { checkPassword, hashing } from '../utils/hashing'
import { prismaClient } from '../application/database'
import { ResponseError } from '../error/reponse.error'
import { signJWT, verifyJWT } from '../utils/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { RequestWithCookies } from '../types/cookies.request'
import crypto from 'crypto'

export class AuthService {
  // Function to generate a refresh token using crypto
  static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(UserValidation.REGISTER, request)

    // Periksa jika pengguna sudah ada
    const userAlreadyExists = await prismaClient.user.findUnique({
      where: {
        email: registerRequest.email
      }
    })

    // Lemparkan error jika pengguna sudah ada
    if (userAlreadyExists) {
      throw new ResponseError(401, 'email already exists')
    }

    // Jika tidak ada pengguna dengan email tersebut, lanjutkan proses registrasi
    registerRequest.password = `${hashing(registerRequest.password)}`
    const user = await prismaClient.user.create({
      data: registerRequest
    })

    return toUserResponse(user)
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginUserRequest = Validation.validate(UserValidation.LOGIN, request)

    // Find user by email
    const user = await prismaClient.user.findUnique({
      where: {
        email: loginUserRequest.email
      }
    })

    // Check if user exists
    if (!user) {
      throw new ResponseError(401, 'username or Password is wrong')
    }

    // Check if password matches
    const isMatch = checkPassword(loginUserRequest.password, user.password)
    if (!isMatch) {
      throw new ResponseError(401, 'username or Password is wrong')
    }

    const accessToken = signJWT({ userId: user.id }, { expiresIn: '15m' })

    // Generate refresh token (valid for 7 days)
    const refreshToken = this.generateRefreshToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Set refresh token expiration to 7 days

    // Save refresh token in the database
    await prismaClient.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    })

    const response = toUserResponse(user)
    response.accessToken = accessToken

    return response
  }

  static async refresh(req: RequestWithCookies): Promise<NewTokenResponse> {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      throw new ResponseError(401, 'Refresh token is missing')
    }

    const { valid, expired, decoded } = verifyJWT(refreshToken)

    if (!valid || expired || !decoded) {
      throw new ResponseError(401, 'Invalid or expired refresh token')
    }

    const user = await prismaClient.user.findUnique({
      where: { email: (decoded as JwtPayload).email }
    })

    if (!user) {
      throw new ResponseError(401, 'User not found')
    }

    const accessToken = signJWT({ ...user }, { expiresIn: '15m' })
    const newRefreshToken = signJWT({ ...user }, { expiresIn: '1y' })

    return toUserResponse(user, accessToken)
  }
}
