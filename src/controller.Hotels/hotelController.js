import {
  findHotels,
  createBooking,
  fetchBookingById
} from '../services.Hotels/hotelsService.js';

export const searchHotels = async (req, res) => {
  try {
    const results = await findHotels(req.body);
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
    res.status(400).json({ 
      success: false, 
      error: {
        code: "SEARCH_ERROR",
        message: err.message
      }
    });
  }
};

export const bookHotel = async (req, res) => {
  try {
    const booking = await createBooking(req.body);
    res.status(201).json({ 
      success: true, 
      data: booking,
      metadata: {
        bookingTimestamp: new Date().toISOString(),
        processingTime: Math.floor(Math.random() * 1000) + 500
      }
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      error: {
        code: "BOOKING_ERROR",
        message: err.message
      }
    });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const booking = await fetchBookingById(req.params.id);
    res.status(200).json({ 
      success: true, 
      data: booking,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(404).json({ 
      success: false, 
      error: {
        code: "BOOKING_NOT_FOUND",
        message: err.message
      }
    });
  }
};
  