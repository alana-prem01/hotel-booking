import express from 'express';
import { getHotels, getHotelById, getRooms } from '../controllers/publicController.js';

const router = express.Router();

router.get('/hotels', getHotels);
router.get('/hotels/:id', getHotelById);
router.get('/rooms', getRooms);

export default router;
