import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import ErrorResponse from '@mopos/constants/ErrorResponse';
import StatusCodes from '@mopos/constants/enums/StatusCodes';
import { AdminAuthRequest } from '@mopos/constants/interfaces/AuthRequest';
import { AdminUser } from '@mopos/models/AdminUser';
import { AdminUserStatus } from '@mopos/constants/enums/User';
import { AdminUserToken } from '@mopos/models/AdminUserToken';
import { AuthInviteType, AuthType } from '@mopos/constants/types/AuthType';
import { InviteToken } from '@mopos/models/InviteAdmin';
;




export const adminUserAuth = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED));
        } else {
            const secret: string = process.env.ADMIN_TOKEN_SECRET!;
            const decoded: AuthType = jwt.verify(token, secret) as AuthType;

            if (decoded) {
                const user = await AdminUser.findOne({ where: { id: decoded.userData.id } });

                if (!user || user.status != AdminUserStatus.ACTIVE) {
                    next(new ErrorResponse("Unauthorized", StatusCodes.FORBIDDEN));
                    return;
                }

                const adminToken = await AdminUserToken.findOne({ where: { token: token, admin_user_id: user.id } });
                if (!adminToken) {
                    next(new ErrorResponse("Unauthorized", StatusCodes.FORBIDDEN));
                    return;
                }

                req.user = user;

                next();
            } else {
                next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED));
            }
        }
    } catch (error) {
        next(new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED))
    }
}


export const adminVerifyInviteAuth = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.body.token;
        console.log(token)
        if (!token) {
            next(new ErrorResponse("Please follow the link sent to your email", StatusCodes.UNAUTHORIZED));
            return
        } 
        const tokenIndb = await InviteToken.findOne({ where: { token: token.trim() } });
        console.log("first", tokenIndb)
        if(!tokenIndb?.dataValues?.token){
            next(new ErrorResponse("Invalid invitaion link provided, approach admin at mopos for a proper invite", StatusCodes.BAD_REQUEST)); 
            return
        }
        console.log("HELLO")
        
            const secret: string = process.env.ADMIN_TOKEN_SECRET!;
            const decoded:AuthInviteType = jwt.verify(token, secret) as AuthInviteType;

            if(!decoded?.exp){
                next(new ErrorResponse("Invalid invitaion link provided, approach admin at mopos for a proper invite", StatusCodes.BAD_REQUEST));
                return  
            }

            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            const isExpired = decoded.exp < currentTime;
            if(isExpired){
                next(new ErrorResponse("Please approached the admin at mopos to resend you an invite, current link has expired", StatusCodes.BAD_REQUEST));  
                return
            }

            if (decoded) {
                const adminToken = await InviteToken.findOne({ where: { admin_user_id: decoded.userData.id } });
                
                console.log(adminToken?.dataValues.id)
                if (!adminToken?.dataValues?.token) {
                    next(new ErrorResponse("Please follow the link sent to your email to procceed", StatusCodes.FORBIDDEN));
                    return;
                }
                const user = await AdminUser.findOne({ where: { id: decoded.userData.id } });

                if (!user) {
                    next(new ErrorResponse("Please follow the link sent to your email to procceed", StatusCodes.FORBIDDEN));
                    return;
                }
                if (user.dataValues.status !== "pending") {
                    next(new ErrorResponse("Please follow the link sent to your email to procceed", StatusCodes.FORBIDDEN));
                    return;
                }
                if (!user) {
                    next(new ErrorResponse("Please follow the link sent to your email to procceed", StatusCodes.FORBIDDEN));
                    return;
                }

                if (adminToken?.dataValues?.token !== token) {
                    next(new ErrorResponse("Please follow the link sent to your email to procceed", StatusCodes.FORBIDDEN));
                    return;
                }
            
                next();
            } 
    
    } catch (error) {
        console.log(error)
        next(new ErrorResponse("Malicious link provided, please follow the link sent to your email", StatusCodes.UNAUTHORIZED))
    }
}