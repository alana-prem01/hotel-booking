import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import argon2 from 'argon2';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log('Connecting to database...');

    // Clear existing admin to avoid duplicates
    await User.deleteMany({ role: 'admin' });

    const hashedPassword = await argon2.hash('admin123');

    console.log('Creating admin user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAdmin();
