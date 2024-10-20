import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { AdminUser } from "@mopos/models/AdminUser";

@Table({
    timestamps: true,
    tableName: 'payment_categories',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})


export class PaymentCategory extends Model {
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

    name!: string
    @Column({
        type: DataType.STRING,
         allowNull: false
    })
    amount!: string

    @Column({
        type: DataType.STRING,
         allowNull: false
    })

    @Column({type: DataType.BOOLEAN, defaultValue: true})
    is_active!: boolean

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    is_deleted!: boolean

    @BelongsTo(() => AdminUser, { foreignKey: 'admin_user_id' })
    admin_user!: AdminUser
}