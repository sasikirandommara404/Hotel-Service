import mongoose from 'mongoose';

// Location Schema
const locationSchema = new mongoose.Schema({
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
    type: [Number], // [longitude, latitude]
    required: true,
    validate: {
      validator: function(coords) {
        return coords.length === 2 && 
               coords[0] >= -180 && coords[0] <= 180 && 
               coords[1] >= -90 && coords[1] <= 90;
      },
      message: 'Invalid coordinates. Must be [longitude, latitude]'
    }
  },
  zipCode: {
    type: String,
    trim: true
  }
}, { _id: false });

// Rating Schema
const ratingSchema = new mongoose.Schema({
  overall: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  breakdown: {
    cleanliness: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    service: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    location: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    value: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  }
}, { _id: false });

// Room Schema
const roomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  maxOccupancy: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    validate: {
      validator: function(url) {
        return /^https?:\/\/.+/.test(url);
      },
      message: 'Invalid image URL'
    }
  }]
}, { _id: false });

// Policies Schema
const policiesSchema = new mongoose.Schema({
  checkIn: {
    type: String,
    default: "15:00"
  },
  checkOut: {
    type: String,
    default: "11:00"
  },
  cancellation: {
    type: String,
    trim: true
  },
  petPolicy: {
    type: String,
    trim: true
  },
  smokingPolicy: {
    type: String,
    trim: true
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
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Main Hotel Schema
const hotelSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  rating: {
    type: ratingSchema,
    required: true
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
  rooms: [{
    type: roomSchema
  }],
  policies: {
    type: policiesSchema,
    default: {}
  },
  metadata: {
    type: metadataSchema,
    required: true
  }
}, {
  timestamps: true, 
  collection: 'hotels'
});

// Indexes for better query performance
hotelSchema.index({ 'location.city': 1 });
hotelSchema.index({ 'location.coordinates': '2dsphere' });
hotelSchema.index({ 'rating.overall': -1 });
hotelSchema.index({ 'metadata.isActive': 1 });
hotelSchema.index({ 'metadata.source': 1 });
hotelSchema.index({ 'amenities': 1 });

// Virtual for full address
hotelSchema.virtual('fullAddress').get(function() {
  const loc = this.location;
  return `${loc.address}, ${loc.city}, ${loc.state} ${loc.zipCode}, ${loc.country}`;
});

// Virtual for average rating
hotelSchema.virtual('averageRating').get(function() {
  if (!this.rating || !this.rating.breakdown) return 0;
  const breakdown = this.rating.breakdown;
  const sum = breakdown.cleanliness + breakdown.service + breakdown.location + breakdown.value;
  return sum / 4;
});

// Pre-save middleware
hotelSchema.pre('save', function(next) {
  // Update lastUpdated timestamp
  this.metadata.lastUpdated = new Date();
  next();
});

// Instance methods
hotelSchema.methods.isAvailable = function() {
  return this.metadata.isActive;
};

hotelSchema.methods.getRatingBreakdown = function() {
  return this.rating.breakdown;
};

hotelSchema.methods.updateRating = function(newRating) {
  this.rating.overall = newRating.overall;
  this.rating.reviews = newRating.reviews;
  this.rating.breakdown = newRating.breakdown;
  return this.save();
};

// Static methods
hotelSchema.statics.findByLocation = function(city, state) {
  return this.find({
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i'),
    'metadata.isActive': true
  });
};

hotelSchema.statics.findByRating = function(minRating) {
  return this.find({
    'rating.overall': { $gte: minRating },
    'metadata.isActive': true
  });
};

hotelSchema.statics.findByAmenities = function(amenities) {
  return this.find({
    'amenities': { $all: amenities },
    'metadata.isActive': true
  });
};

hotelSchema.statics.findNearby = function(coordinates, maxDistance = 10) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    'metadata.isActive': true
  });
};

// Create and export the model
const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;