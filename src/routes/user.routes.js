import { Router } from 'express'
import {
    signup,
    login,
    requestPasswordReset,
    resetPassword,
} from '../controllers/auth.controller.js'
import { verifyUserEmail } from '../utils/commonFunction.js'

const userRoute = Router()

userRoute.post('/signup', signup)
userRoute.post('/login', login)
userRoute.post('/request-password-reset', requestPasswordReset)
userRoute.patch('/reset-password/:token', resetPassword)
userRoute.get("/verification/employer-account/:id",verifyUserEmail);


export default userRoute
