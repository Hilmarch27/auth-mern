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
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

app.use(deserializeToken)

routes(app)
// error handle for all routes
app.use(errorMiddleware)
