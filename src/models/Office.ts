
import { Table, Model, Column, PrimaryKey, DataType, BelongsTo } from "sequelize-typescript";
import { AdminUser } from "./AdminUser";
// import otpGenerator from 'otp-generator';
// import { UserVerification } from "@seedng/models/UserVerification";
// import { OTPTypes } from "@seedng/constants/enums/User";

@Table({
    timestamps: true,
    tableName: 'offices',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

export class Office extends Model{
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    lga!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    is_active!: boolean;
    
    @BelongsTo(() => AdminUser, { foreignKey: 'added_by_id' })
    added_by!: AdminUser
   

    getDetails()
    {
        return {
            id: this.id,
            lga: this.lga,
            city: this.city,
            is_active:this.is_active,
            created_at: this.createdAt,
        }
    }
}