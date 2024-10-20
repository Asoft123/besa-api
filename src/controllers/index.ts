

import AdminUserController from "@mopos/controllers/AdminUserController";
import PaymentCategoryController from "@mopos/controllers/PaymentCategoryController";

const controllers  = [
   AdminUserController.createInstance(),
   PaymentCategoryController.createInstance()
]

export default controllers;