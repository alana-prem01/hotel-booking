import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';
import User from './models/User.js';
import Owner from './models/Owner.js';
import argon2 from 'argon2';
import { hotelsData, roomsData } from './data.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connecting to:', process.env.MONGO_URI);

    // Clear existing data
    await Hotel.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();
    await Owner.deleteMany();

    const hashedPassword = await argon2.hash('admin123');

    console.log('Creating admin...');
    try {
      await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin created.');
    } catch (e) {
      console.error('Admin creation failed:', e.message);
      throw e;
    }

    console.log('Creating owner...');
    try {
      const owner = await Owner.create({
        name: 'LuxeStay Admin',
        email: 'owner@luxestay.com',
        password: hashedPassword,
        companyName: 'LuxeStay Properties',
        status: 'approved'
      });
      console.log('Owner created:', owner._id);

      console.log('Seeding hotels...');
      const createdHotels = [];
      for (const h of hotelsData) {
        console.log(`Seeding hotel: ${h.name}...`);
        const hotel = await Hotel.create({
          ...h,
          ownerId: owner._id
        });
        createdHotels.push(hotel);
        console.log(`Hotel ${h.name} created.`);
      }

      console.log('Seeding rooms...');
      for (const r of roomsData) {
        const hotel = createdHotels.find(h => h.name === r.hotelName);
        if (hotel) {
          console.log(`Seeding room: ${r.type} for ${r.hotelName}...`);
          await Room.create({
            ...r,
            hotelId: hotel._id
          });
          console.log(`Room ${r.type} created.`);
        }
      }
    } catch (e) {
      console.error('Data seeding failed:', e.message);
      throw e;
    }

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
