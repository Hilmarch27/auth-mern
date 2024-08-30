import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'

export const AuthRouter: Router = Router()

AuthRouter.post('/register', AuthController.register)
AuthRouter.post('/login', AuthController.login)
AuthRouter.post('/refresh', AuthController.refresh)
