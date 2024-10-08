import { User } from '@prisma/client'

export interface UserResponse {
  userId?: string
  name: string
  email: string
  role?: string
  created_at?: Date
  updated_at?: Date
  accessToken?: string
  token?: string
  signature?: string
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
}

export interface LoginUserRequest {
  email: string
  password: string
}

export interface NewTokenResponse {
  userId: string
  revoked: boolean
  accessToken?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface TokenResponse {
  userId: string
  role: string
  iat: number
  exp: number
}

// transform user to user response
export function toUserResponse (user: User, token?: string): UserResponse {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    token
  }
}
