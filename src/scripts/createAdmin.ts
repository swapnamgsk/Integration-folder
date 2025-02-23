import mongoose from 'mongoose';
import User from '../models/user';
import { connectToDatabase } from '../utils/db';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  await connectToDatabase();

  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    console.log('Admin already exists');
    return;
  }

  const email = 'admin@example.com';
  const password = 'adminpassword';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    email,
    password: hashedPassword,
    role: 'admin',
    username: 'admin',
  });

  try {
    await admin.save();
    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
