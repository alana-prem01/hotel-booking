import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

// @desc    Search/Get all active hotels
// @route   GET /api/public/hotels
// @access  Public
export const getHotels = async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, rating, city } = req.query;

    let query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (minPrice || maxPrice) {
      query.basePricePerNight = {};
      if (minPrice) query.basePricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.basePricePerNight.$lte = Number(maxPrice);
    }

    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get hotel details with rooms
// @route   GET /api/public/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel) {
      const rooms = await Room.find({ hotelId: hotel._id });
      res.json({ hotel, rooms });
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all rooms (featured)
// @route   GET /api/public/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    const { city } = req.query;
    
    let query = {};
    if (city) {
      // Find hotels in that city first
      const hotels = await Hotel.find({ 'location.city': { $regex: city, $options: 'i' } });
      const hotelIds = hotels.map(h => h._id);
      query.hotelId = { $in: hotelIds };
    }

    const rooms = await Room.find(query).populate('hotelId', 'name location images');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
