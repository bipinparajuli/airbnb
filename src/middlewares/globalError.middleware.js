export const globalErrorHandler = (error, req, res, next) => {
    console.log(error.statusCode,error.message);
    return res.status(error.statusCode).json({
        error: error.name,
        message: error.message,
    })
}
