import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { ResponseError } from '../error/reponse.error'
import { formatZodError } from '../utils/format.error.zod'

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation Error',
      errors: formatZodError(error)
    })
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      message: error.message,
      errors: error.errors ?? [{ message: error.message }]
    })
  } else {
    res.status(500).json({
      message: 'Internal Server Error',
      errors: [{ message: error.message }]
    })
  }
}
