import { Validation } from '../validations/validation'
import {
  CreateUserRequest,
  LoginUserRequest,
  NewTokenResponse,
  RefreshTokenRequest,
  toUserResponse,
  UserResponse
} from '../models/user.model'
import { UserValidation } from '../validations/auth.validation'
import { checkPassword, hashing } from '../utils/hashing'
import { prismaClient } from '../application/database'
import { ResponseError } from '../error/reponse.error'
import { signJWT } from '../utils/jwt'
import crypto from 'crypto'
import { encryptData } from '../utils/aes-256'

export class AuthService {
  // Function to generate a refresh token using crypto
  static generateRefreshToken(): string {
    const randomToken = crypto.randomBytes(64).toString('hex')
    const token = crypto.createHash('sha256').update(randomToken).digest('hex')
    return token
  }

  // Clean up expired tokens (remove tokens older than 7 days)
  static async cleanUpExpiredTokens(): Promise<void> {
    await prismaClient.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date() // Delete tokens where expiration date is in the past
        }
      }
    })
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

    // Retrieve old tokens
    const oldTokens = await prismaClient.refreshToken.findMany({
      where: { userId: user.id, revoked: false }
    })

    // Revoke old tokens
    await prismaClient.refreshToken.updateMany({
      where: { token: { in: oldTokens.map((token) => token.token) } },
      data: { revoked: true }
    })

    const accessToken = signJWT({ userId: user.id, role: user.role }, { expiresIn: '15m' })

    const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days expiration
    const signatureData = {
      userId: user.id,
      expiresAt: expirationTime
    }

    // Encrypt signature data (userId + expiresAt)
    const signature = encryptData(JSON.stringify(signatureData))
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
    response.signature = signature

    return response
  }

  static async refresh(userId: string): Promise<NewTokenResponse> {
    const refreshRequest = Validation.validate(UserValidation.REFRESH, userId)
    console.info('refresh request', refreshRequest)
    const users = await prismaClient.user.findUnique({
      where: {
        id: refreshRequest
      },
      include: {
        refreshTokens: true // Include refresh tokens in the response
      }
    })

    if (!users) {
      throw new ResponseError(404, 'User not found')
    }

    // Filter refresh tokens yang belum dicabut (revoked === false)
    const validToken = users.refreshTokens.find((token) => !token.revoked)
    if (!validToken) {
      throw new ResponseError(401, 'No valid refresh token found')
    }
    // Check if the refresh token exists and is valid
    const tokenRecord = await prismaClient.refreshToken.findUnique({
      where: { token: validToken.token, revoked: false },
      include: {
        user: true // This includes the related User record
      }
    })

    if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      throw new ResponseError(401, 'Refresh token is invalid or expired')
    }

    // Extract user details from the tokenRecord
    const { user } = tokenRecord

    // Generate a new access token
    const newAccessToken = signJWT({ userId: user.id, role: user.role }, { expiresIn: '15m' })

    return {
      userId: user.id,
      revoked: tokenRecord.revoked,
      accessToken: newAccessToken
    }
  }

  static async logout(request: RefreshTokenRequest): Promise<NewTokenResponse> {
    const refreshRequest = Validation.validate(UserValidation.REFRESH, request)
    // Find the refresh token in the database
    const tokenRecord = await prismaClient.refreshToken.findUnique({
      where: { token: refreshRequest.refreshToken }
    })

    // Check if token exists
    if (!tokenRecord) {
      throw new ResponseError(401, 'Invalid refresh token')
    }

    // Revoke the refresh token
    const result = await prismaClient.refreshToken.update({
      where: { token: refreshRequest.refreshToken },
      data: { revoked: true }
    })

    return {
      userId: result.userId,
      revoked: result.revoked
    }
  }
}
