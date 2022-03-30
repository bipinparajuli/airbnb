export const globalErrorHandler = (error, req, res, next) => {
    res.status(error.statusCode).json({
        error: error.name,
        message: error.message,
    })
}
