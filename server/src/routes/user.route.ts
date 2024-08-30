import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { requireUser } from '../middleware/auth'

export const UserRouter: Router = Router()

UserRouter.get('/current', requireUser, UserController.get)
