import StatusCodes from "@mopos/constants/enums/StatusCodes";
import ErrorResponse from "@mopos/constants/ErrorResponse";
import { CreatePaymentType } from "@mopos/constants/types/Payment";
import { AdminUser } from "@mopos/models/AdminUser";
import { Payment } from "@mopos/models/Payment";
import { PaymentCategory } from "@mopos/models/PaymentCategory";


class PaymentService {

  public async userPayments() {
    return await Payment.findAll({ order: [["created_at", "DESC"]] });
  }

  public async activeCategories() {
    return await Payment.findAll({
      where: { is_active: true },
      order: [["created_at", "DESC"]],
    });
  }
  public async printReceipt(paymentid:string) {
   
    const isReceipt = await Payment.findOne({
      where: { id: paymentid },
    });
    if (!isReceipt) {
        throw new ErrorResponse(
          "Enter a valid transaction ID",
          StatusCodes.BAD_REQUEST
        );
      }
      return isReceipt
  }
  
  public async createPayment(
    user: AdminUser,
    payment:CreatePaymentType
  ) {
    const isExist = await PaymentCategory.findOne({ where: { id: payment.payment_category } });
    if (!isExist) {
      throw new ErrorResponse(
        "Please select value business category",
        StatusCodes.BAD_REQUEST
      );
    }

   return await Payment.create({
      lastname:payment.lastname,
      firstname:payment.firstname,
      email:payment.email,
      business_category:isExist.dataValues.name,
      phoneNumber:payment.phoneNumber,
      payment_cat_id:isExist.dataValues.id,
      business_name:payment.business_name,
      business_address:payment.business_address,
      amount: isExist.dataValues.amount,
      transaction_id:payment.transaction_id,
      admin_user_id:null ,
    });
  }

  public async updatePayment(
    user: AdminUser,
    categoryId: string,
    data: { [key: string]: any }
  ) {
    const values: { [key: string]: any } = {};
    const category = await Payment.findByPk(categoryId, {
      attributes: { exclude: ["admin_user_id"] },
    });
    if (!category) {
      throw new ErrorResponse(
        "No user category found",
        StatusCodes.BAD_REQUEST
      );
    }

    if (data.name) {
      values.name = data.name;
    }
    if (data.amount) {
      values.amount = data.amount;
    }

    if (data.is_active || !data.is_active) {
      values.is_active = data.is_active;
    }
    await category.update(values);

    return category;
  }

  public async categories() {
    return await Payment.findAll({
      where: { is_active: false },
      include: [AdminUser],
      attributes: { exclude: ["admin_user_id"] },
    });
  }
}

export default PaymentService;