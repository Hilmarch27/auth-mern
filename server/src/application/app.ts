import * as dotenv from 'dotenv'
import express, { Application, urlencoded } from 'express'
import { errorMiddleware } from '../middleware/error.middleware'
import { routes } from '../routes'
import cors from 'cors'
import deserializeToken from '../middleware/deserializedToken'
import cookieParser from 'cookie-parser'
dotenv.config()

export const app: Application = express()

app.use(express.json())
app.use(urlencoded({ extended: false }))
// Tambahkan di app.ts
app.use(cookieParser())

//cors access hanfler
// Konfigurasi CORS dengan opsi yang sesuai
app.use(cors({
  origin: 'http://localhost:5173', // Ganti dengan asal frontend Anda
  credentials: true, // Mengizinkan pengiriman cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Daftar metode yang diizinkan
  allowedHeaders: ['Content-Type', 'Authorization'] // Daftar header yang diizinkan
}))

// !deleted if cors 
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', '*')
//   res.setHeader('Access-Control-Allow-Headers', '*')
//   next()
// })

app.use(deserializeToken)

routes(app)
// error handle for all routes
app.use(errorMiddleware)
