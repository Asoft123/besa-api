import { AdminUser } from "./AdminUser";
import { AdminUserToken } from "./AdminUserToken";
import { InviteToken } from "./InviteAdmin";
import { Office } from "./Office";
import { Payment } from "./Payment";
import { PaymentCategory } from "./PaymentCategory";
import { Permit } from "./Permits";

const models = [
    // User,
    Office,
    AdminUser,
    AdminUserToken,
    PaymentCategory,
    Payment,
    Permit,
    InviteToken,
    // Customer,
    // Investment,
    // Investor,
    // Loan,
    // Repayment
]

export default models;