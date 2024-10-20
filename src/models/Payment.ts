import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { AdminUser } from "@mopos/models/AdminUser";
import { PaymentCategory } from "./PaymentCategory";

@Table({
    timestamps: true,
    tableName: 'payment',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})


export class Payment extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    firstname!: string
    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    lastname!: string
    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    amount!: string

  @Column({
        type: DataType.ENUM('pending', 'verified' ),
        allowNull: false,
        defaultValue: 'pending',
    })
    status!: string;
    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    email!:string
    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    phoneNumber!:string

    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    business_name!:string

    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    business_category!:string

    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    business_address!:string

    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    transaction_id!:string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    is_active!: boolean;

    @BelongsTo(() => PaymentCategory, { foreignKey: 'payment_cat_id' })
    payment_category!: PaymentCategory

    @BelongsTo(() => AdminUser, { foreignKey: 'admin_user_id' })
    admin_user!: AdminUser
}