import express from 'express';
import {
  searchHotels,
  bookHotel,
  getBookingDetails
} from '../controller.Hotels/hotelController.js';

const router = express.Router();

// POST /api/hotels/search
router.post('/search', searchHotels);

// POST /api/hotels/book
router.post('/book', bookHotel);

// GET /api/hotels/bookings/:id
router.get('/bookings/:id', getBookingDetails);

export default router;
