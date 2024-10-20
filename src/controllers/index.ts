

import AdminUserController from "@mopos/controllers/AdminUserController";
import PaymentCategoryController from "@mopos/controllers/PaymentCategoryController";
import PaymentController from "./PaymentController";

const controllers  = [
   AdminUserController.createInstance(),
   PaymentCategoryController.createInstance(),
   PaymentController.createInstance()
]

export default controllers;