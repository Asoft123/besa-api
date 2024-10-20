import { PaginationParams } from './../constants/interfaces/pagination';
import dotenv from 'dotenv';

import StatusCodes from '@mopos/constants/enums/StatusCodes';
import { AdminUserStatus } from '@mopos/constants/enums/User';
import ErrorResponse from '@mopos/constants/ErrorResponse';
import { AdminUser } from '@mopos/models/AdminUser';
import { AdminUserToken } from '@mopos/models/AdminUserToken';

import sendEmailService from '@mopos/utils/email';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthInviteType } from '@mopos/constants/types/AuthType';
import { InviteToken } from '@mopos/models/InviteAdmin';
import { BASE_CLIENT } from '@mopos/utils/helpers';
import { Op, FindOptions } from 'sequelize';
import { getPagination, getSearch, getSorting } from '@mopos/utils/pagination';
import { Office } from '@mopos/models/Office';
dotenv.config();


class AdminUserService {
 
    public async addAdmin(user: AdminUser, name: string, email: string, role: string, password: string, officeId:string) {
        const isExist = await AdminUser.findOne({ where: { email: email } });
        if (isExist) {
            throw new ErrorResponse('The user already exists', StatusCodes.BAD_REQUEST);
        }
        let officeid;
        if(officeId){

            const office:Office | null = await Office.findByPk(officeId, {attributes:{ exclude: [ 'added_by_id'] }});
            if(office?.id){
             officeid = office.id
            }else {
                officeid = null
            }
        }
        const hPassword: string = await bcrypt.hash(password, 10);

        await AdminUser.create({
            name,
            email,
            role,
            password: hPassword,
            added_by_id: user?.id ? user?.id : null,
            office_by_id:officeid ? officeId : null
           
        });
    }

    public async acceptInvite( password:string, token:string){
        const secret: string = process.env.ADMIN_TOKEN_SECRET!;
        const decoded: any = jwt.verify(token, secret)

        const newAdmin = await AdminUser.findByPk(decoded.userData.id, {attributes:{ exclude: [ 'added_by_id'] }});

        const hashPassword: string = await bcrypt.hash(password, 10);

        await newAdmin?.update({password:hashPassword, status:"active"})
        
        await InviteToken.destroy({where:{token:token}})

        return newAdmin
    }

    public async invite(user: AdminUser, name: string, email: string, role: string, officeId:string) {
        const isExist = await AdminUser.findOne({ where: { email: email } });
        if (isExist) {
            throw new ErrorResponse('The staff already exists', StatusCodes.BAD_REQUEST);
        }
        let officeid;
        if(officeId){

            const office:Office | null = await Office.findByPk(officeId, {attributes:{ exclude: [ 'added_by_id'] }});
            if(office?.id){
             officeid = office.id
            }else {
                throw new ErrorResponse('Please select an office for this staff', StatusCodes.BAD_REQUEST);
            }
        }
        const hPassword: string = await bcrypt.hash(process.env.DEFAULT_PASSWORD as string, 10);
     

        const secret: string = process.env.ADMIN_TOKEN_SECRET!;
        
            
            let newStaff = await AdminUser.create({
                name,
                email,
                role,
                status:"pending",
                password: hPassword,
                added_by_id: user?.id ? user?.id : null,
                office_by_id:officeid
                
            });
            

            if(newStaff.id){
                const userData = {
                    id: newStaff.id,
                    name:newStaff.name,
                    email:newStaff.email,
                };
                const tokenG = jwt.sign({ userData }, process.env.ADMIN_TOKEN_SECRET!, { expiresIn: process.env.INVITE_TOKEN_EXPIRES_IN });
        
               let  tokenCreated = await InviteToken.create({
                   token: tokenG,
                   admin_user_id: newStaff.id,
                });
                if(tokenCreated.id){
                await sendEmailService({to:email, data: {link:`${BASE_CLIENT}/verify?search=${tokenCreated.token}`}, path:"forgotpassword", subject:"WELCOME TO mopos",from: "mopos25@gmail.com" });
                return newStaff
            }
            }
            return newStaff;

    }


    public async verify(inviteToken:string) {
        const tokenUser = await InviteToken.findOne({where:{token:inviteToken}})
        if(!tokenUser){
            throw new ErrorResponse("Pleases follow the link sent to your email", StatusCodes.BAD_REQUEST); 
        }
        return tokenUser
    }
    
    public async login(email: string, password: string) {
        const user = await AdminUser.findOne({ where: { email: email, is_deleted: false }, attributes: { exclude: ['added_by_id'] } });

        if (!user || user.status != AdminUserStatus.ACTIVE) {
            throw new ErrorResponse("Invalid login credentials", StatusCodes.BAD_REQUEST);
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) throw new ErrorResponse("Invalid login credentials", StatusCodes.BAD_REQUEST);

        const userData = {
            id: user.id,
        };

        const secret: string = process.env.ADMIN_TOKEN_SECRET!;
        const token = jwt.sign({ userData }, secret, { expiresIn: process.env.ADMIN_TOKEN_EXPIRES_IN });

        await AdminUserToken.create({
            token: token,
            admin_user_id: user.id,
        });

        await AdminUser.update({ last_login: Date.now() }, { where: { id: user.id } });

        return {
            user: await AdminUser.findByPk(user.id, { attributes: { exclude: ['password', 'added_by_id'] } }),
            token: token,
        };
    }

    public async deleteAdmin(user: AdminUser, adminId:string){
        const adminUser = await AdminUser.findByPk(adminId, {attributes:{ exclude: [ 'added_by_id'] }});
        if (!adminUser) {
            throw new ErrorResponse("No Admin user was found", StatusCodes.NOT_FOUND);
        }
    
    
       const deletedOffice =  await AdminUser.destroy({where: {
          id: adminId
        }})
    
        if(!deletedOffice){
          throw new ErrorResponse("An unexpected error occured while deleting Admin", StatusCodes.BAD_REQUEST);
        }
     return deletedOffice;
      }
    public async sendEmail() {
        return await sendEmailService({to:"cicerofestus@gmail.com", data: {link:`http://localhost:5173/new/accept/q=hhdjhhdhjdhjd}`}, path:"forgotpassword", subject:"WELCOME TO mopos",from: "" });
    }

    
    public async users(query:PaginationParams) {

        const pagination = getPagination(query);
        const sorting = getSorting(query);
        const search = getSearch(query);
        
       const admins =  await AdminUser.findAndCountAll(
           { ...pagination,
            ...sorting,
            ...search,
            attributes: { exclude: ['password', 'added_by_id'] },
            include:[{model:AdminUser,
                attributes:{ exclude: [ 'password', 'added_by_id'] }}, {model:Office, attributes: { exclude: ['office_by_id',] } }]
            
           }
            );
            const totalPages = Math.ceil(admins.count / pagination.limit);
            const currentPage = query.page ? +query.page : 1;
    
            // Determine the previous and next page numbers
            const previousPage = currentPage > 1 ? currentPage - 1 : null;
            const nextPage = currentPage < totalPages ? currentPage + 1 : null;
            return { 
                data: admins.rows,
                meta:
            {totalItems: admins.count,
            totalPages: totalPages,
            currentPage: currentPage,
            previousPage: previousPage,
            nextPage: nextPage,}}
    }
    public async user(user:AdminUser) {

        return await AdminUser.findByPk(user.id,{ attributes: { exclude: ['added_by_id', 'password'] } });
    }

    public async updateStatus(user: AdminUser, adminId:string , data: { [key: string]: any }) {
        const values: { [key: string]: any } = {};
        if(data.status){
            values.status = data.status
          }
        const adminUser = await AdminUser.findByPk(adminId, {attributes:{ exclude: [ 'added_by_id'] }});
        if (!adminUser) {
            throw new ErrorResponse("No staff was found found", StatusCodes.BAD_REQUEST);
        }
    
        await adminUser.update(values);

        return adminUser;
       
    }
    public async updateStaff(user: AdminUser, adminId:string , data: { [key: string]: any }) {
        const values: { [key: string]: any } = {};
        if(data.status){
            values.status = data.status
          }
          
        const adminUser = await AdminUser.findByPk(adminId, {attributes:{ exclude: [ 'added_by_id'] }});
        if (!adminUser) {
            throw new ErrorResponse("No staff was found found", StatusCodes.BAD_REQUEST);
        }
    
        await adminUser.update(values);

        return adminUser;
       
    }

    public async userById(adminId:string) {
       const admin = await AdminUser.findByPk(adminId, { 
            attributes: { exclude: ['office_by_id', 'password', 'office_by_id'] },
            include:[{model:AdminUser, attributes: { exclude: ['added_by_id', 'password'] } },
            {model:Office, attributes: { exclude: ['office_by_id',] } }
        ] });
        if (!admin) {
            throw new ErrorResponse("No staff was found", StatusCodes.BAD_REQUEST);
        }
        return admin
    }

    public async updateProfileImage(adminId:string, url:string){
        const admin = await AdminUser.findByPk(adminId, { 
            attributes: { exclude: ['office_by_id', 'password', 'office_by_id'] },
            include:[{model:AdminUser, attributes: { exclude: ['added_by_id', 'password'] } },
            {model:Office, attributes: { exclude: ['office_by_id',] } }
        ] });
        if (!admin) {
            throw new ErrorResponse("No staff was found", StatusCodes.BAD_REQUEST);
        }

        return admin.update({avatar:url})
    }

}

export default AdminUserService