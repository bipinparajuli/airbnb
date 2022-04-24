import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'

export const sendToken = (userId,role,message, res, next) => {
    try {
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })
        res.cookie('jwt', token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), //30 days
        })
        res.status(200).json({
            status: 'success',
            message,
            data: {
                token,
                id:userId,
                role:role
            },
        })
    } catch (error) {
        next(createHttpError(500, error.message))
    }
}
