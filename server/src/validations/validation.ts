import { ResponseError } from '../error/reponse.error'
import { formatZodError } from '../utils/format.error.zod'
import { ZodType, ZodError } from 'zod'

export class Validation {
  static validate<T>(schema: ZodType, data: T): T {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ResponseError(400, 'Validation Error', formatZodError(error))
      }
      throw error // Lempar kembali jika bukan ZodError
    }
  }
}
