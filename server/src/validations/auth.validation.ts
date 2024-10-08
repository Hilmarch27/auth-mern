import { z, ZodType } from 'zod'

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    userId: z.string().optional(),
    name: z.string().min(1),
    email: z.string().min(1),
    role: z.string().optional(),
    password: z.string().min(1)
  })

  static readonly LOGIN: ZodType = z.object({
    email: z.string().email('Email is not valid'),
    password: z.string().min(1, 'Password must not be empty')
  })

  static readonly REFRESH: ZodType = z.string().min(1)

  static readonly USER_ID: ZodType = z.string().min(1)
}
