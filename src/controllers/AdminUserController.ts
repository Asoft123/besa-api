import { buildV1AppPath } from '@mopos/utils/helpers';
import { adminVerifyInviteAuth } from './../middlewares/validations/authentication';
import { AdminAuthRequest } from "@mopos/constants/interfaces/AuthRequest";
import { PaginationParams } from '@mopos/constants/interfaces/pagination';
import { validateAdminIdRequest, validateAdminInviteRequest, validateAdminLoginRequest } from "@mopos/middlewares/validations/adminValidations";
import { adminUserAuth } from "@mopos/middlewares/validations/authentication";
import upload from '@mopos/middlewares/validations/multer';

import AdminUserService from "@mopos/services/AdminService";
import { NextFunction, Request, Response } from "express";
import { BaseController, controller, middlewares, route } from "express-ts-annotations";



@controller(buildV1AppPath('admins'))
class AdminUserController extends BaseController {
 
    @route('get', '/')
    @middlewares([adminUserAuth])
    public async getAdminUsers(req: AdminAuthRequest, res: Response, next: NextFunction) {
        // const { page = 1, pageSize = 10, sort = 'name', order = 'ASC', search = '' } = req.query;
        const query = req.query as unknown as PaginationParams;
        console.log(query)
        try {
            const data = await (new AdminUserService()).users(query);

            return res.json({
                message: "Fetched all Admin users",
                success: true,
                data: data?.data,
                meta:data?.meta
            });
        } catch (error) {
            next(error);
        }
    }
    @route('get', '/whoiam')
    @middlewares([adminUserAuth])
    public async getAdminUser(req: AdminAuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await (new AdminUserService()).user(req.user!);
          console.log("WE GOT HERE")
            return res.json({
                message: "Admin profile fetched successfully",
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    
    @route('get', '/details/:adminId')
    @middlewares([adminUserAuth])
    public async getAdminUserById(req: AdminAuthRequest, res: Response, next: NextFunction) {
        const { adminId } = req.params;
       
        try {
            const data = await (new AdminUserService()).userById(adminId);

            return res.json({
                message: "Fetched Admin user successfully",
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
    @route('patch', '/status/:adminId')
    @middlewares([adminUserAuth])
    public async toggleAdminUserStatus(req: AdminAuthRequest, res: Response, next: NextFunction) {
        const { adminId } = req.params;
       console.log(adminId)
        try {
            const data = await (new AdminUserService()).updateStatus(req.user!, adminId, req.body);

            return res.json({
                message: "Staff status updated successfully",
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
    @route('patch', '/upload-dp/:adminId')
    @middlewares([adminUserAuth, upload.single("picture")])
    public async uploadAdminUserDp(req: AdminAuthRequest, res: Response, next: NextFunction) {
        const { adminId } = req.params;
       console.log(req.file)
       console.log(req.protocol, req.host, req.hostname)
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded or invalid file type' });
              }
            const data = await (new AdminUserService()).updateProfileImage(adminId, `/${req?.file?.path}`);

            return res.json({
                message: "Staff display picture updated successfully",
                success: true,
                // data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('put', '/:adminId')
    @middlewares([adminUserAuth])
    public async editStaff(req: AdminAuthRequest, res: Response, next: NextFunction) {
        const { adminId } = req.params;
  
        try {
            const data = await (new AdminUserService()).updateStaff(req.user!, adminId, req.body);

            return res.json({
                message: "Staff status updated successfully",
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }

    @route('post', '/')
    @middlewares([adminUserAuth])
    public async createAdmin(req: AdminAuthRequest, res: Response, next: NextFunction) {
        console.log("HERE FOR",req.body)
        try {
            await (new AdminUserService()).addAdmin(req.user!, req.body.name, req.body.email, req.body.role, req.body.password, req.body.officeId);
            return res.json({
                success: true,
                message: 'You have successfully added an admin',
            });
        } catch (error) {
            next(error);
        }
    }


   
    @route("post", "/sendemail")
    public async sendEmail(req: Request, res: Response, next: NextFunction){
        try {
            await (new AdminUserService()).sendEmail();

            return res.json({
                success: true,
                message: 'Email was successfully sent',
            });
        } catch (error) {
            next(error);
        }
    }

    @route("post", "/invite")
    @middlewares([adminUserAuth, validateAdminInviteRequest])
    public async InviteAdmin(req: AdminAuthRequest, res: Response, next: NextFunction){
        try {
            await (new AdminUserService()).invite(req.user!, req.body.name, req.body.email, req.body.role, req.body.officeId);

            return res.json({
                success: true,
                message: 'Staff invited was successfully sent',
            });
        } catch (error) {
            next(error);
        }
    }
    @route('delete', '/:adminId')
    @middlewares([adminUserAuth, validateAdminIdRequest])
    public async deleteAdmin(req:AdminAuthRequest, res:Response, next:NextFunction){
        const adminId = req.params.adminId
        try {
            await (new AdminUserService()).deleteAdmin(req.user!,adminId);

            return res.json({
                success: true,
                message: 'Admin deleted successfully',
            });
        } catch (error) {
            next(error);
        }

    }
    @route("post", "/verify")
    @middlewares([adminVerifyInviteAuth])
    public async verifyInviteAdmin(req: Request, res: Response, next: NextFunction){

            return res.json({
                success: true,
                message: 'Link verification was successful, please create password and login',
            });

    }
    @route("post", "/accept")
    @middlewares([adminVerifyInviteAuth])
    public async acceptAdmin(req: Request, res: Response, next: NextFunction){


        try {
            await (new AdminUserService()).acceptInvite( req.body.password, req.body.token);

            return res.json({
                success: true,
                message: 'Welcome mopos, pleaase proceed to login',
            });
        } catch (error) {
            next(error);
        }
    }
    
    @route('post', '/token')
    @middlewares([validateAdminLoginRequest])
    public async adminUserLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await (new AdminUserService()).login(req.body.email, req.body.password);

            return res.json({
                success: true,
                data: data
            });
        } catch (error) {
            next(error);
        }
    }
    public static createInstance(): AdminUserController {
        return new AdminUserController();
    }
} 

export default AdminUserController;