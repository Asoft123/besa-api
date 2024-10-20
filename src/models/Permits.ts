import {
  BelongsTo,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { AdminUser } from "@mopos/models/AdminUser";


@Table({
  timestamps: true,
  tableName: "permits",
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class Permit extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  business_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  amount!: string;

  @Column({
    type: DataType.ENUM("pending", "verified"),
    allowNull: false,
    defaultValue: "pending",
  })
  status!: string;

  @Column({ type: DataType.TEXT("long"), allowNull: false })
  slug!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  business_address!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active!: boolean;

  @BelongsTo(() => AdminUser, { foreignKey: "admin_user_id" })
  admin_user!: AdminUser;
}
