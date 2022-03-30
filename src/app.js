import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import expressRateLimit from 'express-rate-limit'
import helmet from 'helmet'
import createHttpError from 'http-errors'

import morgan from 'morgan'
import userRoute from './routes/user.routes.js'
import ownerRoute from './routes/owner.route.js'
import tenantRoute from './routes/tenant.route.js'



import { globalErrorHandler } from './middlewares/globalError.middleware.js'

dotenv.config()

const app = express()

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// compress response body for performance gains
// app.use(cors())

app.use(compression())
// { origin: 'http://localhost:3000', credentials: true }
app.use(cors())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
// additional security headers
app.use(helmet())
// limit the number of requests to prevent DDOS attacks
app.use(
    expressRateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests.Please try again after 15 minutes',
    })
)
// remove operator injection attacks
app.use(mongoSanitize())

// register routes
app.use('/api/v1/users', userRoute)
app.use('/api/v1/users', ownerRoute)
app.use('/api/v1/users', tenantRoute)

// app.use('/api/v1/products', productRoute)

// handles non existing routes
app.use('*', (req, res, next) => {
    console.log(req.url);
    next(
        createHttpError(404, `Route ${req.originalUrl} doesn't exist on this server`)
    )
})
// global error handling middleware
app.use(globalErrorHandler)

export default app
