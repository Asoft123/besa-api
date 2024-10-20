import { AdminAuthRequest } from "@mopos/constants/interfaces/AuthRequest";
import { CreatePaymentType } from "@mopos/constants/types/Payment";
import { adminUserAuth } from "@mopos/middlewares/validations/authentication";
import PaymentCategoryService from "@mopos/services/PaymentCategoryService";
import PaymentService from "@mopos/services/PaymentService";
import { buildV1AppPath } from "@mopos/utils/helpers";
import { NextFunction, Request, Response } from "express";
import { BaseController, controller, middlewares, route } from "express-ts-annotations";

@controller(buildV1AppPath('payments'))
class PaymentController extends BaseController {
    @route('get', '/')
    @middlewares([adminUserAuth])
    public async getPayments(req: AdminAuthRequest, res: Response, next: NextFunction) {
        try {
            const data = await (new PaymentService()).userPayments();
            return res.json({
                message: "Fetched all payment categories",
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
    
    @route('get', '/active/operational')
    @middlewares([adminUserAuth])
    public async getActiveCategories(req:Request, res:Response, next:NextFunction){
        try {
            const data = await (new PaymentCategoryService()).activeCategories();
            return res.json({
                message:"Fetched all active payment categories successfully",
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
       
    }

    @route('get', '/details/:paymentId')
    public async getReceipt(req:Request, res:Response, next:NextFunction){
        const paymentId = req.params.paymentId
        try {
            const data = await (new PaymentService()).printReceipt(paymentId);
            return res.json({
                message:"receipt fetched successfully",
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
       
    }
    @route('post', '/')
 
    // @middlewares([adminUserAuth])

    public async createdPayment(req: AdminAuthRequest, res: Response, next: NextFunction) {
        const payment = req.body as CreatePaymentType
        try {
           const data = await (new PaymentService()).createPayment(req.user!, payment);

            return res.json({
                success: true,
                message: 'Payment  was successfuly',
                data
            });
        } catch (error) {
            next(error);
        }
    }

    @route('patch', '/:categoryId')
    @middlewares([adminUserAuth])
    public async updateOffice(req: AdminAuthRequest, res: Response, next: NextFunction) {
        const categoryId = req.params.categoryId
        console.log(req.body)
        try {
            await (new PaymentCategoryService()).updateCategory(req.user!,categoryId, req.body);

            return res.json({
                success: true,
                message: 'Payment category updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }
    public static createInstance(): PaymentController {
        return new PaymentController();
    }
} 

export default PaymentController;