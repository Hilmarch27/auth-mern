import bcrypt from 'bcrypt'

//encode
export function hashing (password: string): string {
  const saltRounds = 10 // Jumlah putaran untuk menghasilkan salt
  const salt = bcrypt.genSaltSync(saltRounds)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

//decode
export const checkPassword = (password: string, userPassword: string) => {
  return bcrypt.compareSync(password, userPassword)
}
