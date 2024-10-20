import { Table, Model, Column, PrimaryKey, DataType, BelongsTo } from "sequelize-typescript";
import { Office } from "./Office";



@Table({
    timestamps: true,
    tableName: 'admin_users',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        
        {
            fields: ['name'],
        },
        {
            fields: ['role'],
        },
        {
            unique: true,
            fields: ['email'], 
        },
    ],
})

export class AdminUser extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column({type: DataType.STRING, allowNull: false})
    name!: string

    @Column({type: DataType.STRING, allowNull: false})
    email!: string

    @Column({type: DataType.STRING, allowNull: false})
    role!: string

    @Column({type: DataType.DATE, allowNull: true})
    last_login!: string

    @Column({type: DataType.STRING, defaultValue: 'active'})
    status!: string

    @Column({type: DataType.STRING, defaultValue: ''})
    avatar!: string

    @Column({type: DataType.STRING, allowNull: false})
    password!: string

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    is_deleted!: boolean

    @BelongsTo(() => AdminUser, { foreignKey: 'added_by_id' })
    added_by!: AdminUser

    @BelongsTo(() => Office, { foreignKey: 'office_by_id' })
    office!: Office


}