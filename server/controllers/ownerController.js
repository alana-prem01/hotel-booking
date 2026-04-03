import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { v2 as cloudinary } from 'cloudinary';

// @desc    Get owner dash stats
// @route   GET /api/owners/dashboard
// @access  Private (Owner)
export const getOwnerDashboardStats = async (req, res) => {
  try {
    const hotels = await Hotel.find({ ownerId: req.user._id });
    const hotelIds = hotels.map(h => h._id);

    const matchObj = { hotelId: { $in: hotelIds }, status: 'completed' };
    
    // Revenue logic, etc...
    const bookings = await Booking.find({ hotelId: { $in: hotelIds }});
    
    const revenue = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((acc, curr) => acc + (curr.ownerEarnings || 0), 0);

    res.json({
      totalHotels: hotels.length,
      totalBookings: bookings.length,
      revenue,
      recentBookings: bookings.slice(-5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload image to Cloudinary
// @route   POST /api/owners/upload
// @access  Private (Owner)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Configure cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload to cloudinary from buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'hotel-booking-app' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error full:', JSON.stringify(error, null, 2));
    console.error('Error message:', error.message);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// @desc    Create new hotel
// @route   POST /api/owners/hotels
// @access  Private (Owner)
export const createHotel = async (req, res) => {
  try {
    const { 
      name, location, description, basePricePerNight, amenities, images,
      roomType, roomPrice, roomCapacity, roomQuantity 
    } = req.body;
    
    if (req.user.status !== 'approved') {
      return res.status(403).json({ message: 'Account not yet approved by admin' });
    }

    const hotel = new Hotel({
      ownerId: req.user._id,
      name,
      location,
      description,
      basePricePerNight,
      amenities,
      images,
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get owner's hotels
// @route   GET /api/owners/hotels
// @access  Private (Owner)
export const getOwnerHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ ownerId: req.user._id });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create room for a hotel
// @route   POST /api/owners/hotels/:id/rooms
// @access  Private (Owner)
export const addRoomToHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel && hotel.ownerId.toString() === req.user._id.toString()) {
      const room = new Room({
        hotelId: hotel._id,
        type: req.body.type,
        price: req.body.price,
        capacity: req.body.capacity,
        quantity: req.body.quantity,
        amenities: req.body.amenities,
        images: req.body.images,
      });
      const createdRoom = await room.save();
      res.status(201).json(createdRoom);
    } else {
      res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a room type
// @route   DELETE /api/owners/rooms/:id
// @access  Private (Owner)
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotelId');
    
    if (room && room.hotelId.ownerId.toString() === req.user._id.toString()) {
      await room.deleteOne();
      res.json({ message: 'Room type deleted successfully' });
    } else {
      res.status(404).json({ message: 'Room not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get bookings for owner's properties
// @route   GET /api/owners/bookings
// @access  Private (Owner)
export const getOwnerBookings = async (req, res) => {
  try {
    const hotels = await Hotel.find({ ownerId: req.user._id });
    const hotelIds = hotels.map(h => h._id);

    const bookings = await Booking.find({ hotelId: { $in: hotelIds } })
      .populate('userId', 'name email')
      .populate('hotelId', 'name')
      .populate('roomId', 'type');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update hotel details
// @route   PUT /api/owners/hotels/:id
// @access  Private (Owner)
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel && hotel.ownerId.toString() === req.user._id.toString()) {
      hotel.name = req.body.name || hotel.name;
      hotel.location = req.body.location || hotel.location;
      hotel.description = req.body.description || hotel.description;
      hotel.basePricePerNight = req.body.basePricePerNight || hotel.basePricePerNight;
      hotel.amenities = req.body.amenities || hotel.amenities;
      if (req.body.images) hotel.images = req.body.images;

      const updatedHotel = await hotel.save();
      res.json(updatedHotel);
    } else {
      res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/owners/hotels/:id
// @access  Private (Owner)
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel && hotel.ownerId.toString() === req.user._id.toString()) {
      // Also delete associated rooms
      await Room.deleteMany({ hotelId: hotel._id });
      await hotel.deleteOne();
      res.json({ message: 'Property deleted successfully' });
    } else {
      res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOwnerHotelRooms = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel || hotel.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }

    const rooms = await Room.find({ hotelId: hotel._id }).lean();
    const today = new Date();
    
    const roomsWithAvailability = await Promise.all(rooms.map(async (room) => {
      const activeBookingsCount = await Booking.countDocuments({
        roomId: room._id,
        status: { $ne: 'cancelled' },
        $and: [
          { checkIn: { $lte: today } },
          { checkOut: { $gt: today } }
        ]
      });
      return {
        ...room,
        availableCount: Math.max(0, room.quantity - activeBookingsCount)
      };
    }));

    res.json(roomsWithAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
