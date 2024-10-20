import { NextFunction, Request, Response } from "express";
import winston from "winston";
import ErrorResonse from "@mopos/constants/ErrorResponse";
import StatusCodes from "@mopos/constants/enums/StatusCodes";

export const errorHandler = (error: ErrorResonse, req: Request, res: Response, next: NextFunction) => {
// const loggger = winston.createLogger({
// level:"info",
// format:winston.format.json(),
// defaultMeta:{service:"user-service"},
//    transports:[ new winston.transports.File({filename:"error.log", level:"error"}),
//     new winston.transports.File({filename:"combine.log", level:"info"})]
// })
// loggger.log({
//     level:"info",
//     message:error.message,
//     error
// })

    return res.status(error.statusCode || StatusCodes.SERVER_ERROR).json({
        success: false,
        error: {
            message: error.message || 'Server error',
        }
    });
}