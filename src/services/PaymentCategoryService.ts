import StatusCodes from "@mopos/constants/enums/StatusCodes";
import ErrorResponse from "@mopos/constants/ErrorResponse";
import { AdminUser } from "@mopos/models/AdminUser";
import { PaymentCategory } from "@mopos/models/PaymentCategory";


class PaymentCategoryService {

  public async userCategories() {
    return await PaymentCategory.findAll({ order: [["created_at", "DESC"]] });
  }

  public async activeCategories() {
    return await PaymentCategory.findAll({
      where: { is_active: true },
      order: [["created_at", "DESC"]],
    });
  }
  
  public async createPaymentCategory(
    user: AdminUser,
    name: string,
    amount: string,
  ) {
    const isExist = await PaymentCategory.findOne({ where: { name: name } });
    if (isExist) {
      throw new ErrorResponse(
        "The category already exists",
        StatusCodes.BAD_REQUEST
      );
    }
console.log(user)
    await PaymentCategory.create({
      name:name,
      amount: amount,
      admin_user_id: user?.dataValues.id,
    });
  }

  public async updateCategory(
    user: AdminUser,
    categoryId: string,
    data: { [key: string]: any }
  ) {
    const values: { [key: string]: any } = {};
    const category = await PaymentCategory.findByPk(categoryId, {
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
    return await PaymentCategory.findAll({
      where: { is_active: false },
      include: [AdminUser],
      attributes: { exclude: ["admin_user_id"] },
    });
  }
}

export default PaymentCategoryService;