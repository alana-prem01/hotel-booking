import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';
import User from './models/User.js';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';

dotenv.config();

const verifyProfitSplit = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ role: 'admin' });
        const hotel = await Hotel.findOne();
        const room = await Room.findOne({ hotelId: hotel._id });

        if (!user || !hotel || !room) {
            console.error('Missing required data for testing');
            process.exit(1);
        }

        const totalAmount = 1000;
        const adminCommission = totalAmount * 0.20;
        const ownerEarnings = totalAmount * 0.80;

        console.log(`Creating test booking for ${totalAmount}...`);
        
        // Simulating the logic in userController.js
        const booking = new Booking({
            userId: user._id,
            hotelId: hotel._id,
            roomId: room._id,
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 86400000),
            totalAmount,
            guests: 1,
            paymentMethod: 'credit_card',
            paymentId: 'test_pay_123',
            adminCommission,
            ownerEarnings,
            status: 'confirmed',
            paymentStatus: 'paid',
        });

        const savedBooking = await booking.save();
        console.log('Booking saved');

        console.log('Verifying splits...');
        console.log('Admin Commission:', savedBooking.adminCommission);
        console.log('Owner Earnings:', savedBooking.ownerEarnings);

        if (savedBooking.adminCommission === 200 && savedBooking.ownerEarnings === 800) {
            console.log('Verification SUCCESSFUL!');
        } else {
            console.error('Verification FAILED!');
        }

        await Booking.deleteOne({ _id: savedBooking._id });
        console.log('Cleaned up test booking');
        
        process.exit(0);
    } catch (error) {
        console.error('Verification Error:', error);
        process.exit(1);
    }
};

verifyProfitSplit();
