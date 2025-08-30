import { hotels, inventory, bookings } from '../utils.Hotels/mockData.js';
import { v4 as uuidv4 } from 'uuid';

export const findHotels = async (searchCriteria) => {
  try {
    const {
      location,
      dates,
      guests,
      filters,
      sorting,
      pagination
    } = searchCriteria;

    // Validate required fields
    if (!location || !dates || !guests) {
      throw new Error("Location, dates, and guests are required");
    }

    // Mock search logic with filtering
    let filteredHotels = [...hotels];

    // Apply location filter
    if (location.city) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.location.city.toLowerCase().includes(location.city.toLowerCase())
      );
    }

    // Apply price filter
    if (filters?.priceRange) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.pricing.totalPrice >= filters.priceRange.min && 
        hotel.pricing.totalPrice <= filters.priceRange.max
      );
    }

    // Apply rating filter
    if (filters?.rating) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.rating.overall >= filters.rating[0] && 
        hotel.rating.overall <= filters.rating[1]
      );
    }

    // Apply amenities filter
    if (filters?.amenities) {
      filteredHotels = filteredHotels.filter(hotel => 
        filters.amenities.every(amenity => 
          hotel.amenities.includes(amenity)
        )
      );
    }

    // Apply sorting
    if (sorting?.by) {
      filteredHotels.sort((a, b) => {
        let aValue, bValue;
        
        switch (sorting.by) {
          case 'price':
            aValue = a.pricing.totalPrice;
            bValue = b.pricing.totalPrice;
            break;
          case 'rating':
            aValue = a.rating.overall;
            bValue = b.rating.overall;
            break;
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          default:
            return 0;
        }

        if (sorting.order === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalResults = filteredHotels.length;
    const totalPages = Math.ceil(totalResults / limit);

    return {
      hotels: paginatedHotels,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        appliedFilters: {
          priceRange: filters?.priceRange,
          rating: filters?.rating,
          amenities: filters?.amenities
        },
        availableFilters: {
          priceRange: [1500, 25000],
          ratings: [3, 4, 5],
          amenities: ["wifi", "parking", "pool", "gym", "spa", "restaurant", "bar"]
        }
      }
    };
  } catch (error) {
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const {
      hotelId,
      userId,
      roomDetails,
      dates,
      guestDetails,
      specialRequests,
      paymentMethod
    } = bookingData;

    // Validate required fields
    if (!hotelId || !userId || !roomDetails || !dates || !guestDetails) {
      throw new Error("Hotel ID, user ID, room details, dates, and guest details are required");
    }

    // Validate dates
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    const now = new Date();

    if (checkIn <= now) {
      throw new Error("Check-in date must be in the future");
    }

    if (checkOut <= checkIn) {
      throw new Error("Check-out date must be after check-in date");
    }

    // Check availability
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    
    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const roomInventory = inventory.find(inv =>
        inv.hotelId === hotelId &&
        inv.roomType === roomDetails.roomType &&
        inv.date === dateStr
      );

      if (!roomInventory || roomInventory.available < roomDetails.roomCount) {
        throw new Error(`Not enough availability for ${dateStr}`);
      }
    }

    // Calculate nights
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Find hotel for pricing
    const hotel = hotels.find(h => h.hotelId === hotelId);
    const basePrice = hotel ? hotel.pricing.basePrice : 5000;
    const taxes = basePrice * 0.12; // 12% tax
    const fees = basePrice * 0.06; // 6% fees
    const totalPrice = (basePrice + taxes + fees) * nights;

    // Generate booking ID
    const bookingId = `BK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const confirmationNumber = `CNF${Date.now().toString().slice(-6)}`;

    // Create booking object
    const booking = {
      bookingId,
      userId,
      hotelInfo: {
        hotelId,
        name: hotel ? hotel.name : "Hotel",
        address: hotel ? hotel.location.address : "",
        phone: "+91-22-12345678"
      },
      roomInfo: {
        roomType: roomDetails.roomType,
        roomCount: roomDetails.roomCount,
        guestCount: roomDetails.guestCount,
        bedType: "King"
      },
      bookingDetails: {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights,
        guestDetails
      },
      pricing: {
        basePrice: basePrice * nights,
        taxes,
        fees,
        totalPrice,
        currency: "INR",
        breakdown: {
          roomCharges: basePrice * nights,
          taxes,
          fees
        }
      },
      payment: {
        paymentId: `PAY_${Date.now()}`,
        paymentMethod: paymentMethod || 'wallet',
        paymentStatus: 'completed',
        walletTransactionId: `TXN_${Date.now()}`
      },
      status: 'confirmed',
      confirmation: {
        confirmationNumber,
        supplierConfirmation: `SUP_${Date.now()}`,
        voucher: `VOUCHER_${Date.now()}`
      },
      metadata: {
        source: 'local',
        bookingChannel: 'web'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Update inventory
    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const roomInventory = inventory.find(inv =>
        inv.hotelId === hotelId &&
        inv.roomType === roomDetails.roomType &&
        inv.date === dateStr
      );

      if (roomInventory) {
        roomInventory.available -= roomDetails.roomCount;
        roomInventory.booked += roomDetails.roomCount;
      }
    }

    // Add booking to mock data
    bookings.push(booking);

    return {
      bookingId,
      status: 'confirmed',
      confirmationNumber,
      hotelInfo: booking.hotelInfo,
      bookingDetails: {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        nights,
        roomType: roomDetails.roomType,
        guestCount: roomDetails.guestCount
      },
      pricing: {
        totalPrice,
        currency: "INR",
        breakdown: booking.pricing.breakdown
      },
      payment: {
        paymentId: booking.payment.paymentId,
        status: 'completed',
        walletTransactionId: booking.payment.walletTransactionId
      }
    };
  } catch (error) {
    throw error;
  }
};

export const fetchBookingById = async (id) => {
  const booking = bookings.find(b => b.bookingId === id);
  if (!booking) throw new Error('Booking not found');
  return booking;
};
