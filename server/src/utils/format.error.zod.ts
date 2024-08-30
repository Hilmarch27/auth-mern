import { ZodError } from 'zod'
// Fungsi untuk memformat ZodError menjadi lebih rapi
export function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message
  }))
}
