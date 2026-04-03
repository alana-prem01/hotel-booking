import express from 'express';
import { getHotels, getHotelById, getRooms } from '../controllers/publicController.js';
import { checkRoomAvailability } from '../controllers/availabilityController.js';


const router = express.Router();

router.get('/hotels', getHotels);
router.get('/hotels/:id', getHotelById);
router.get('/rooms', getRooms);
router.get('/rooms/:id/availability', checkRoomAvailability);


export default router;
