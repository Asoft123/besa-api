import { Request } from "express";
import { AdminUser } from "@mopos/models/AdminUser";




export interface AdminAuthRequest extends Request{
    user?: AdminUser
}