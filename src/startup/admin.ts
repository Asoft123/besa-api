import bcrypt from 'bcryptjs'; // Use bcrypt to hash passwords
import dotenv from 'dotenv';
import { AdminUserRole } from '@mopos/constants/enums/User';
import { AdminUser } from '@mopos/models/AdminUser'; // Import the User model

async function createAdminUserOnStartup() {
  try {

const admin_password = process.env.ADMIN_PASSWORD as string
    const adminExists = await AdminUser.findOne({ where: { role: AdminUserRole.SUPERADMIN } });

    if (!adminExists) {
      
      const hashedPassword = await bcrypt.hash(admin_password, 10);
      await AdminUser.create({
        name: 'Super Admin',
        email:process.env.ADMIN_EMAIL as string,
        password: hashedPassword,
        role: AdminUserRole.SUPERADMIN
      });

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

export default createAdminUserOnStartup;