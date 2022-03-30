import createHttpError from 'http-errors'

export const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(error =>
            next(createHttpError(error.statusCode || 500, error.message))
        )
    }
}
