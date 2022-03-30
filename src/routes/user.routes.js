import { Router } from 'express'
import {
    signup,
    login,
    requestPasswordReset,
    resetPassword,
} from '../controllers/auth.controller.js'

const userRoute = Router()

userRoute.post('/signup', signup)
userRoute.post('/login', login)
userRoute.post('/request-password-reset', requestPasswordReset)
userRoute.patch('/reset-password/:token', resetPassword)
export default userRoute
