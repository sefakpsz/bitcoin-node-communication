import { HttpStatusCode } from 'axios'
import { NextFunction, Request, Response } from 'express'

export const notFoundError = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCode.NotFound).json({
        errorMessage: "Path Couldn't Found!"
    })
}

export const validationError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        return res.json({
            error: err.error.toString()
        })
    }
    return next()
}

export const exceptionHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(`Error Message: ${error.message}`)
    const status = error.status || 500

    return res.status(status).json({
        errorMessage: error.message || "Internal Server Error",
    })
}