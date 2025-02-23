import dotenv from 'dotenv';
import { connectDB } from './database';
import User from '../models/User';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword123';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

export const seedAdmin = async (): Promise<void> => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!adminExists) {
      await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
