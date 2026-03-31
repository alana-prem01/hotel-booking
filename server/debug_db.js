import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';

dotenv.config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const hotels = await Hotel.find();
        console.log(`Found ${hotels.length} hotels`);
        
        for (const hotel of hotels) {
            const rooms = await Room.find({ hotelId: hotel._id });
            console.log(`Hotel: ${hotel.name}, Rooms Count: ${rooms.length}`);
            rooms.forEach(r => console.log(`  - Room: ${r.type} ($${r.price})`));
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debug();
