import StatusCodes from "@mopos/constants/enums/StatusCodes";
import ErrorResponse from "@mopos/constants/ErrorResponse";
import { formatResult } from "@mopos/validations/formatResults";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";


export const validateAdminLoginRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}
export const validateAdminInviteRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Staff name"),
        email: Joi.string().required().label("Email"),
        role: Joi.string().valid("super_admin", "auditor", "supervisor", "loan_officer", "manager").required().label("Role"),
        officeId: Joi.string().trim().guid({ version: ['uuidv4', 'uuidv5'] }).required().label("Office ID"),
    });

    const result = formatResult(schema.validate(req.body));

    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}
export const validateAdminIdRequest = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        adminId: Joi.string().trim().guid({ version: ['uuidv4', 'uuidv5'] }).required().label("Admin ID"),
    });

    const result = formatResult(schema.validate(req.params));
    if (result.error) {
        next(new ErrorResponse(result.message!, StatusCodes.BAD_REQUEST))
    }

    next();
}