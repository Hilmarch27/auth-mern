export class ResponseError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: Array<{ field: string, message: string }> // Menambahkan parameter optional untuk daftar error
  ) {
    super(message)
  }
}
