import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { AdminUser } from "@mopos/models/AdminUser";

@Table({
    timestamps: true,
    tableName: 'invite_tokens',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})


export class InviteToken extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column({type: DataType.TEXT('long'), allowNull: false})
    token!: string

    @BelongsTo(() => AdminUser, { foreignKey: 'admin_user_id' })
    admin_user!: AdminUser
}