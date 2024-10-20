import bcrypt from 'bcryptjs'; // Use bcrypt to hash passwords
import dotenv from 'dotenv';
import { AdminUserRole } from '@mopos/constants/enums/User';
import { AdminUser } from '@mopos/models/AdminUser'; // Import the User model
import { Office } from '@mopos/models/Office';

async function createOfficeOnStartup() {
  try {
    const offices = await Office.count();
    console.log('Offices count', offices);
    if (offices <= 0) {
      
    
      await Office.create({
        name: 'Tombia - Igbogene',
        city:"yenagoa",
        lga:"yenagoa",
        address:"No 23 mbiama yenagoa road opposite kpansia market",
      });

      console.log('Office user created successfully');
    } else {
      console.log('Offices already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

export default createOfficeOnStartup;