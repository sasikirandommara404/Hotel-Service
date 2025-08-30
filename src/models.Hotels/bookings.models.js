import mongoose from 'mongoose';

const guestDetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  type: {
    type: String,
    required: true,
    enum: ['primary', 'additional'],
    default: 'primary'
  },
  passportNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  phone: {
    type: String,
    trim: true
  }
}, { _id: false });

// Hotel Info Schema
const hotelInfoSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function(url) {
        return /^https?:\/\/.+/.test(url);
      },
      message: 'Invalid image URL'
    }
  }],
  phone: {
    type: String,
    trim: true
  }
}, { _id: false });

// Room Info Schema
const roomInfoSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
    trim: true
  },
  roomCount: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  guestCount: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  bedType: {
    type: String,
    trim: true
  },
  roomNumber: {
    type: String,
    trim: true
  }
}, { _id: false });

// Booking Details Schema
const bookingDetailsSchema = new mongoose.Schema({
  checkInDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Check-in date must be in the future'
    }
  },
  checkOutDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > this.checkInDate;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  nights: {
    type: Number,
    required: true,
    min: 1,
    max: 365
  },
  guestDetails: [{
    type: guestDetailsSchema,
    required: true
  }],
  specialRequests: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { _id: false });

// Pricing Breakdown Schema
const pricingBreakdownSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  }
}, { _id: false });

// Pricing Schema
const pricingSchema = new mongoose.Schema({
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  taxes: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  fees: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discounts: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  breakdown: [{
    type: pricingBreakdownSchema
  }],
  appliedPromoCode: {
    type: String,
    trim: true
  },
  cashbackAmount: {
    type: Number,
    min: 0,
    default: 0
  }
}, { _id: false });

// Payment Schema
const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['wallet', 'credit_card', 'debit_card', 'net_banking', 'upi'],
    default: 'wallet'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  walletTransactionId: {
    type: String,
    trim: true
  },
  gatewayTransactionId: {
    type: String,
    trim: true
  },
  paymentTimestamp: {
    type: Date,
    default: Date.now
  },
  failureReason: {
    type: String,
    trim: true
  }
}, { _id: false });

// Confirmation Schema
const confirmationSchema = new mongoose.Schema({
  confirmationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  supplierConfirmation: {
    type: String,
    trim: true
  },
  voucher: {
    type: String,
    trim: true
  },
  voucherUrl: {
    type: String,
    validate: {
      validator: function(url) {
        return /^https?:\/\/.+/.test(url);
      },
      message: 'Invalid voucher URL'
    }
  },
  confirmationTimestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Cancellation Schema
const cancellationSchema = new mongoose.Schema({
  cancelledAt: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  cancelledBy: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'system', 'supplier'],
    default: 'user'
  },
  refundAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  penaltyAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  refundTransactionId: {
    type: String,
    trim: true
  }
}, { _id: false });

// Modification Schema
const modificationSchema = new mongoose.Schema({
  modifiedAt: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'system'],
    default: 'user'
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  additionalCharges: {
    type: Number,
    min: 0,
    default: 0
  },
  reason: {
    type: String,
    trim: true
  },
  previousBookingData: {
    type: mongoose.Schema.Types.Mixed
  }
}, { _id: false });

// Metadata Schema
const metadataSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    enum: ['booking.com', 'expedia', 'agoda', 'hotels.com', 'local'],
    default: 'local'
  },
  bookingChannel: {
    type: String,
    required: true,
    enum: ['web', 'mobile_app', 'api', 'call_center'],
    default: 'web'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  sessionId: {
    type: String,
    trim: true
  }
}, { _id: false });

// Main Booking Schema
const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    trim: true
  },
  companyId: {
    type: String,
    trim: true
  },
  hotelInfo: {
    type: hotelInfoSchema,
    required: true
  },
  roomInfo: {
    type: roomInfoSchema,
    required: true
  },
  bookingDetails: {
    type: bookingDetailsSchema,
    required: true
  },
  pricing: {
    type: pricingSchema,
    required: true
  },
  payment: {
    type: paymentSchema,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['initiated', 'validated', 'payment_pending', 'confirmed', 'completed', 'cancelled', 'modified'],
    default: 'initiated'
  },
  confirmation: {
    type: confirmationSchema
  },
  cancellation: {
    type: cancellationSchema
  },
  modification: {
    type: modificationSchema
  },
  metadata: {
    type: metadataSchema,
    required: true
  }
}, {
  timestamps: true,
  collection: 'bookings'
});

// Indexes for better query performance
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ 'hotelInfo.hotelId': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'bookingDetails.checkInDate': 1 });
bookingSchema.index({ 'bookingDetails.checkOutDate': 1 });
bookingSchema.index({ 'payment.paymentStatus': 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'metadata.source': 1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  if (!this.bookingDetails) return 0;
  const checkIn = new Date(this.bookingDetails.checkInDate);
  const checkOut = new Date(this.bookingDetails.checkOutDate);
  return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
});

// Virtual for is active booking
bookingSchema.virtual('isActive').get(function() {
  const now = new Date();
  const checkIn = new Date(this.bookingDetails.checkInDate);
  const checkOut = new Date(this.bookingDetails.checkOutDate);
  return now >= checkIn && now <= checkOut;
});

// Virtual for is upcoming booking
bookingSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const checkIn = new Date(this.bookingDetails.checkInDate);
  return now < checkIn;
});

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  // Auto-calculate nights if not provided
  if (this.bookingDetails && this.bookingDetails.checkInDate && this.bookingDetails.checkOutDate) {
    const checkIn = new Date(this.bookingDetails.checkInDate);
    const checkOut = new Date(this.bookingDetails.checkOutDate);
    this.bookingDetails.nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }
  
  // Auto-calculate total price if not provided
  if (this.pricing && this.pricing.basePrice !== undefined) {
    this.pricing.totalPrice = this.pricing.basePrice + this.pricing.taxes + this.pricing.fees - this.pricing.discounts;
  }
  
  next();
});

// Instance methods
bookingSchema.methods.canCancel = function() {
  const now = new Date();
  const checkIn = new Date(this.bookingDetails.checkInDate);
  const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
  
  // Can cancel if more than 24 hours before check-in
  return hoursUntilCheckIn > 24 && this.status === 'confirmed';
};

bookingSchema.methods.canModify = function() {
  const now = new Date();
  const checkIn = new Date(this.bookingDetails.checkInDate);
  const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
  
  // Can modify if more than 2 hours before check-in
  return hoursUntilCheckIn > 2 && this.status === 'confirmed';
};

bookingSchema.methods.calculateRefundAmount = function() {
  if (this.status !== 'cancelled') return 0;
  
  const now = new Date();
  const checkIn = new Date(this.bookingDetails.checkInDate);
  const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
  
  if (hoursUntilCheckIn > 24) {
    return this.pricing.totalPrice; // Full refund
  } else if (hoursUntilCheckIn > 2) {
    return this.pricing.totalPrice * 0.5; // 50% refund
  } else {
    return 0; // No refund
  }
};

// Static methods
bookingSchema.statics.findByUserId = function(userId, status = null) {
  const query = { userId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

bookingSchema.statics.findByHotelId = function(hotelId) {
  return this.find({ 'hotelInfo.hotelId': hotelId }).sort({ createdAt: -1 });
};

bookingSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    'bookingDetails.checkInDate': { $gte: startDate },
    'bookingDetails.checkOutDate': { $lte: endDate }
  });
};

bookingSchema.statics.findActiveBookings = function() {
  const now = new Date();
  return this.find({
    'bookingDetails.checkInDate': { $lte: now },
    'bookingDetails.checkOutDate': { $gte: now },
    status: 'confirmed'
  });
};

bookingSchema.statics.findUpcomingBookings = function() {
  const now = new Date();
  return this.find({
    'bookingDetails.checkInDate': { $gt: now },
    status: 'confirmed'
  });
};

bookingSchema.statics.getBookingStats = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$pricing.totalPrice' }
      }
    }
  ]);
};

// Create and export the model
const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;