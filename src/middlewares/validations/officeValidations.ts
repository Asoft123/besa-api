import StatusCodes from "@mopos/constants/enums/StatusCodes";
import ErrorResponse from "@mopos/constants/ErrorResponse";
import { formatResult } from "@mopos/validations/formatResults";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const JoiObj: typeof Joi & { objectId?: any } = Joi;

JoiObj.objectId = require('joi-objectid')(Joi)

export const validateCreateOfficeRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().max(100).required(),
        state: Joi.string().trim().max(100).required(),
        lga: Joi.string().trim().min(3).max(100).required(),
        city: Joi.string().trim().max(100).required(),
        address: Joi.string().trim().min(8).required(),
        contact1: Joi.string().trim().allow(""),
        contact2: Joi.string().trim().allow(""),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateEditOfficeRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().required().optional(),
        state: Joi.string().trim().required().optional(),
        lga: Joi.string().trim().required().optional(),
        city: Joi.string().trim().required().optional(),
        address: Joi.string().optional(),
        contact1: Joi.string().trim().allow(""),
        contact2: Joi.string().trim().allow(""),
        is_active:Joi.boolean().optional().label("Office Status")
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}

export const validateOfficeIdRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        officeId: Joi.string().trim().guid({ version: ['uuidv4', 'uuidv5'] }).required().label("Office ID"),
    });

    const result = formatResult(schema.validate(req.params));
    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}