import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Owner from './models/Owner.js';
import Hotel from './models/Hotel.js';

dotenv.config();

const debug = async () => {
  await connectDB();
  try {
    const owner = await Owner.create({
      name: 'Test Owner',
      email: 'test@owner.com',
      password: 'password',
      status: 'approved'
    });
    console.log('Owner created:', owner._id);

    const hotel = await Hotel.create({
      ownerId: owner._id,
      name: 'Test Hotel',
      location: {
        city: 'Test City',
        address: 'Test Address'
      },
      description: 'Test Description',
      basePricePerNight: 100
    });
    console.log('Hotel created:', hotel._id);
  } catch (err) {
    console.log('Error:', err.message);
    if (err.errors) console.log('Details:', Object.keys(err.errors));
  }
  process.exit();
};

debug();
