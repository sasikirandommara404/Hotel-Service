import express from 'express';
import {hotelSearchSchema} from '../validation/inputdataValidation.js';
import {
  searchHotels,
  bookHotel,
  getBookingDetails
} from '../controller.Hotels/hotelController.js';
import { authenticate, authorize } from '../middleware/authentication.js';
import { validateInputData } from '../middleware/validation.js';
import {hotelBookingSchema} from '../validation/bookinginputValidation.js';


const router = express.Router();

// POST /api/hotels/search
router.post('/search',validateInputData(hotelSearchSchema),authenticate,authorize, searchHotels);

// POST /api/hotels/book
router.post('/book',validateInputData(hotelBookingSchema), bookHotel);

// GET /api/hotels/bookings/:id
router.get('/bookings/:id', getBookingDetails);

export default router;
