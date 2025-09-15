import {
  findHotels,
  createBooking,
  fetchBookingById
} from '../services.Hotels/hotelsService.js';
import AppError from '../utils.Hotels/appError.js';

export const searchHotels = async (req, res,next) => {
  try {
    const results = await findHotels(req.body);
    if(results.length === 0){
      throw new AppError('No hotels found matching the criteria', 404);
    }
    res.status(200).json({ 
      success: true, 
      data: results,
      metadata: {
        searchId: `search_${Date.now()}`,
        timestamp: new Date().toISOString(),
        responseTime: Math.floor(Math.random() * 500) + 200
      }
    });
  } catch (err) {
    next(err);
  }
};

export const bookHotel = async (req, res,next) => {
  try {
    const booking = await createBooking(req.body);
    if(!booking){
      throw new AppError("Failed to book hotel", 500);
    }
    res.status(201).json({ 
      success: true, 
      data: booking,
      metadata: {
        bookingTimestamp: new Date().toISOString(),
        processingTime: Math.floor(Math.random() * 1000) + 500
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getBookingDetails = async (req, res,next) => {
  try {
    const booking = await fetchBookingById(req.params.id);
    if (!booking) {
      throw new AppError(`Booking with ID ${req.params.id} not found`, 404);
    }
    res.status(200).json({ 
      success: true, 
      data: booking,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
   
  }
};
  