import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  available: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  booked: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  blocked: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  reserved: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maintenance: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, { _id: false });

// Rate Code Schema
const rateCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Restrictions Schema
const restrictionsSchema = new mongoose.Schema({
  minStay: {
    type: Number,
    min: 1,
    default: 1
  },
  maxStay: {
    type: Number,
    min: 1,
    default: 365
  },
  closeToArrival: {
    type: Boolean,
    default: false
  },
  closeToDeparture: {
    type: Boolean,
    default: false
  },
  advanceBookingRequired: {
    type: Number, // Days in advance
    min: 0,
    default: 0
  },
  lastMinuteBookingAllowed: {
    type: Boolean,
    default: true
  },
  weekendRestrictions: {
    type: Boolean,
    default: false
  },
  holidayRestrictions: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Pricing Schema
const pricingSchema = new mongoose.Schema({
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  rateCode: {
    type: rateCodeSchema,
    required: true
  },
  taxes: {
    type: Number,
    min: 0,
    default: 0
  },
  fees: {
    type: Number,
    min: 0,
    default: 0
  },
  surcharges: {
    type: Number,
    min: 0,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  isDynamicPricing: {
    type: Boolean,
    default: false
  },
  dynamicPricingFactors: {
    demandLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'peak'],
      default: 'medium'
    },
    occupancyRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    seasonalMultiplier: {
      type: Number,
      min: 0.1,
      max: 5.0,
      default: 1.0
    }
  }
}, { _id: false });

// Inventory Lock Schema
const inventoryLockSchema = new mongoose.Schema({
  lockId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  sessionId: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    trim: true
  },
  lockedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Supplier Info Schema
const supplierInfoSchema = new mongoose.Schema({
  supplierId: {
    type: String,
    required: true,
    trim: true
  },
  supplierName: {
    type: String,
    required: true,
    trim: true
  },
  supplierCode: {
    type: String,
    trim: true
  },
  lastSyncAt: {
    type: Date,
    default: Date.now
  },
  syncStatus: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  errorMessage: {
    type: String,
    trim: true
  }
}, { _id: false });

// Main Inventory Schema
const inventorySchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true
  },
  roomType: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  availability: {
    type: availabilitySchema,
    required: true
  },
  pricing: {
    type: pricingSchema,
    required: true
  },
  restrictions: {
    type: restrictionsSchema,
    default: {}
  },
  locks: [{
    type: inventoryLockSchema
  }],
  supplierInfo: {
    type: supplierInfoSchema,
    required: true
  },
  metadata: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    source: {
      type: String,
      required: true,
      enum: ['booking.com', 'expedia', 'agoda', 'hotels.com', 'local'],
      default: 'local'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    version: {
      type: Number,
      default: 1
    }
  }
}, {
  timestamps: true,
  collection: 'inventory'
});

// Compound index for efficient queries
inventorySchema.index({ hotelId: 1, roomType: 1, date: 1 }, { unique: true });
inventorySchema.index({ date: 1 });
inventorySchema.index({ 'metadata.source': 1 });
inventorySchema.index({ 'metadata.lastUpdated': -1 });
inventorySchema.index({ 'availability.available': 1 });
inventorySchema.index({ 'pricing.totalPrice': 1 });

// Virtual for availability percentage
inventorySchema.virtual('availabilityPercentage').get(function() {
  if (!this.availability || this.availability.total === 0) return 0;
  return Math.round((this.availability.available / this.availability.total) * 100);
});

// Virtual for is available
inventorySchema.virtual('isAvailable').get(function() {
  return this.availability && this.availability.available > 0;
});

// Virtual for is low availability
inventorySchema.virtual('isLowAvailability').get(function() {
  return this.availability && this.availability.available <= 2;
});

// Virtual for is sold out
inventorySchema.virtual('isSoldOut').get(function() {
  return this.availability && this.availability.available === 0;
});

// Virtual for effective price
inventorySchema.virtual('effectivePrice').get(function() {
  if (!this.pricing) return 0;
  return this.pricing.discountedPrice || this.pricing.totalPrice;
});

// Pre-save middleware
inventorySchema.pre('save', function(next) {
  // Auto-calculate total price if not provided
  if (this.pricing && this.pricing.basePrice !== undefined) {
    this.pricing.totalPrice = this.pricing.basePrice + this.pricing.taxes + this.pricing.fees + this.pricing.surcharges;
  }
  
  // Auto-calculate discounted price if discount percentage is provided
  if (this.pricing && this.pricing.discountPercentage > 0) {
    this.pricing.discountedPrice = this.pricing.totalPrice * (1 - this.pricing.discountPercentage / 100);
  }
  
  // Validate availability totals
  if (this.availability) {
    const total = this.availability.available + this.availability.booked + this.availability.blocked + this.availability.reserved + this.availability.maintenance;
    if (total !== this.availability.total) {
      this.availability.total = total;
    }
  }
  
  // Update last updated timestamp
  this.metadata.lastUpdated = new Date();
  
  next();
});

// Instance methods
inventorySchema.methods.canBook = function(quantity = 1) {
  return this.availability && this.availability.available >= quantity;
};

inventorySchema.methods.reserveInventory = function(quantity, sessionId, userId, lockDuration = 15) {
  if (!this.canBook(quantity)) {
    throw new Error('Insufficient inventory');
  }
  
  const lockId = `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = new Date(Date.now() + lockDuration * 60 * 1000); // Convert minutes to milliseconds
  
  const lock = {
    lockId,
    sessionId,
    userId,
    lockedAt: new Date(),
    expiresAt,
    quantity,
    isActive: true
  };
  
  this.locks.push(lock);
  this.availability.available -= quantity;
  this.availability.reserved += quantity;
  
  return lockId;
};

inventorySchema.methods.releaseInventory = function(lockId) {
  const lockIndex = this.locks.findIndex(lock => lock.lockId === lockId && lock.isActive);
  
  if (lockIndex === -1) {
    throw new Error('Lock not found or already released');
  }
  
  const lock = this.locks[lockIndex];
  lock.isActive = false;
  
  this.availability.available += lock.quantity;
  this.availability.reserved -= lock.quantity;
  
  return true;
};

inventorySchema.methods.confirmBooking = function(quantity, lockId) {
  const lockIndex = this.locks.findIndex(lock => lock.lockId === lockId && lock.isActive);
  
  if (lockIndex === -1) {
    throw new Error('Lock not found or already released');
  }
  
  const lock = this.locks[lockIndex];
  lock.isActive = false;
  
  this.availability.reserved -= lock.quantity;
  this.availability.booked += lock.quantity;
  
  return true;
};

inventorySchema.methods.updateAvailability = function(available, booked, blocked, reserved, maintenance) {
  this.availability.available = available;
  this.availability.booked = booked;
  this.availability.blocked = blocked;
  this.availability.reserved = reserved;
  this.availability.maintenance = maintenance;
  this.availability.total = available + booked + blocked + reserved + maintenance;
  
  return this.save();
};

// Static methods
inventorySchema.statics.findByHotelAndDate = function(hotelId, startDate, endDate) {
  return this.find({
    hotelId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

inventorySchema.statics.findAvailableRooms = function(hotelId, checkIn, checkOut, roomType = null) {
  const query = {
    hotelId,
    date: { $gte: checkIn, $lt: checkOut },
    'availability.available': { $gt: 0 }
  };
  
  if (roomType) {
    query.roomType = roomType;
  }
  
  return this.find(query).sort({ date: 1 });
};

inventorySchema.statics.findByPriceRange = function(hotelId, minPrice, maxPrice, date) {
  return this.find({
    hotelId,
    date,
    'pricing.totalPrice': { $gte: minPrice, $lte: maxPrice },
    'availability.available': { $gt: 0 }
  });
};

inventorySchema.statics.getInventoryStats = function(hotelId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        hotelId,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$roomType',
        totalRooms: { $sum: '$availability.total' },
        totalAvailable: { $sum: '$availability.available' },
        totalBooked: { $sum: '$availability.booked' },
        avgPrice: { $avg: '$pricing.totalPrice' },
        minPrice: { $min: '$pricing.totalPrice' },
        maxPrice: { $max: '$pricing.totalPrice' }
      }
    }
  ]);
};

inventorySchema.statics.cleanExpiredLocks = function() {
  const now = new Date();
  return this.updateMany(
    {
      'locks.expiresAt': { $lt: now },
      'locks.isActive': true
    },
    {
      $set: {
        'locks.$.isActive': false
      }
    }
  );
};

inventorySchema.statics.bulkUpdateAvailability = function(updates) {
  const bulkOps = updates.map(update => ({
    updateOne: {
      filter: {
        hotelId: update.hotelId,
        roomType: update.roomType,
        date: update.date
      },
      update: {
        $set: {
          'availability': update.availability,
          'pricing': update.pricing,
          'metadata.lastUpdated': new Date()
        }
      },
      upsert: true
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

// Create and export the model
const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;