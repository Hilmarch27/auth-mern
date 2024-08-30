import { User } from '@prisma/client'

export interface UserResponse {
  user_id?: string
  name: string
  email: string
  role?: string
  created_at?: Date
  updated_at?: Date
  accessToken?: string
  refreshToken?: string
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

// transform user to user response
export function toUserResponse (user: User, accessToken?: string, refreshToken?: string): UserResponse {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken
  }
}
