# Hotel Service API Documentation

## �� **Project Overview**

**Service Name**: Hotel Service  
**Port**: 3005  

**Database**: MongoDB (with mock data for development)  
**Communication Protocol**: REST API  

## 🎯 **Implemented Tasks**

### ✅ **Task 1: Hotel Search Endpoint**
- **Endpoint**: `POST /api/hotels/search`
- **Status**: ✅ Implemented with mock data
- **Features**: Filtering, sorting, pagination

### ✅ **Task 2: Hotel Booking Endpoint**
- **Endpoint**: `POST /api/hotels/book`
- **Status**: ✅ Implemented with validation
- **Features**: Date validation, availability check, pricing calculation

### ✅ **Task 3: Get Booking Details Endpoint**
- **Endpoint**: `GET /api/hotels/bookings/:id`
- **Status**: ✅ Implemented
- **Features**: Retrieve booking by ID

### ✅ **Task 4: Room Availability Logic**
- **Status**: ✅ Implemented
- **Features**: Real-time availability checking, inventory management

---

## 📡 **API Endpoints**

### 1. **Search Hotels**
**Endpoint**: `POST /api/hotels/search`

**Request Body**:
```json
{
  "location": {
    "city": "Mumbai"
  },
  "dates": {
    "checkIn": "2024-08-15",
    "checkOut": "2024-08-17"
  },
  "guests": {
    "adults": 2,
    "children": 0,
    "rooms": 1
  },
  "filters": {
    "priceRange": {
      "min": 2000,
      "max": 10000
    },
    "rating": [4, 5],
    "amenities": ["wifi", "parking"]
  },
  "sorting": {
    "by": "price",
    "order": "asc"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "hotels": [
      {
        "hotelId": "HOTEL_001",
        "name": "Grand Mumbai Hotel",
        "location": {
          "address": "Marine Drive, Mumbai",
          "city": "Mumbai",
          "state": "Maharashtra",
          "country": "India",
          "coordinates": [72.8777, 19.0760]
        },
        "rating": {
          "overall": 4.5,
          "reviews": 1250,
          "breakdown": {
            "cleanliness": 4.6,
            "service": 4.4,
            "location": 4.8,
            "value": 4.3
          }
        },
        "images": [
          "https://example.com/hotel1-image1.jpg",
          "https://example.com/hotel1-image2.jpg"
        ],
        "pricing": {
          "basePrice": 5000,
          "totalPrice": 5900,
          "currency": "INR",
          "breakdown": {
            "basePrice": 5000,
            "taxes": 600,
            "fees": 300
          }
        },
        "amenities": ["wifi", "parking", "pool", "gym", "spa"],
        "availability": {
          "roomsAvailable": 5,
          "roomType": "Deluxe Room"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalResults": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "appliedFilters": {
        "priceRange": { "min": 2000, "max": 10000 },
        "rating": [4, 5],
        "amenities": ["wifi", "parking"]
      },
      "availableFilters": {
        "priceRange": [1500, 25000],
        "ratings": [3, 4, 5],
        "amenities": ["wifi", "parking", "pool", "gym", "spa", "restaurant", "bar"]
      }
    }
  },
  "metadata": {
    "searchId": "search_1703123456789",
    "timestamp": "2024-01-01T10:30:00.000Z",
    "responseTime": 245
  }
}
```

### 2. **Book Hotel**
**Endpoint**: `POST /api/hotels/book`

**Request Body**:
```json
{
  "hotelId": "HOTEL_001",
  "userId": "user_123",
  "roomDetails": {
    "roomType": "Deluxe Room",
    "roomCount": 1,
    "guestCount": 2
  },
  "dates": {
    "checkIn": "2024-08-16",
    "checkOut": "2024-08-17"
  },
  "guestDetails": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "age": 30,
      "type": "primary"
    }
  ],
  "specialRequests": "Late check-in",
  "paymentMethod": "wallet"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "bookingId": "BK_1703123456789_abc123def",
    "status": "confirmed",
    "confirmationNumber": "CNF345678",
    "hotelInfo": {
      "hotelId": "HOTEL_001",
      "name": "Grand Mumbai Hotel",
      "address": "Marine Drive, Mumbai",
      "phone": "+91-22-12345678"
    },
    "bookingDetails": {
      "checkIn": "2024-08-16T00:00:00.000Z",
      "checkOut": "2024-08-17T00:00:00.000Z",
      "nights": 1,
      "roomType": "Deluxe Room",
      "guestCount": 2
    },
    "pricing": {
      "totalPrice": 5900,
      "currency": "INR",
      "breakdown": {
        "roomCharges": 5000,
        "taxes": 600,
        "fees": 300
      }
    },
    "payment": {
      "paymentId": "PAY_1703123456789",
      "status": "completed",
      "walletTransactionId": "TXN_1703123456789"
    }
  },
  "metadata": {
    "bookingTimestamp": "2024-01-01T10:30:00.000Z",
    "processingTime": 750
  }
}
```

### 3. **Get Booking Details**
**Endpoint**: `GET /api/hotels/bookings/:id`

**Example**: `GET /api/hotels/bookings/BK_1703123456789_abc123def`

**Response**:
```json
{
  "success": true,
  "data": {
    "bookingId": "BK_1703123456789_abc123def",
    "userId": "user_123",
    "hotelInfo": {
      "hotelId": "HOTEL_001",
      "name": "Grand Mumbai Hotel",
      "address": "Marine Drive, Mumbai",
      "phone": "+91-22-12345678"
    },
    "roomInfo": {
      "roomType": "Deluxe Room",
      "roomCount": 1,
      "guestCount": 2,
      "bedType": "King"
    },
    "bookingDetails": {
      "checkInDate": "2024-08-16T00:00:00.000Z",
      "checkOutDate": "2024-08-17T00:00:00.000Z",
      "nights": 1,
      "guestDetails": [
        {
          "firstName": "John",
          "lastName": "Doe",
          "age": 30,
          "type": "primary"
        }
      ]
    },
    "pricing": {
      "basePrice": 5000,
      "taxes": 600,
      "fees": 300,
      "totalPrice": 5900,
      "currency": "INR",
      "breakdown": {
        "roomCharges": 5000,
        "taxes": 600,
        "fees": 300
      }
    },
    "payment": {
      "paymentId": "PAY_1703123456789",
      "paymentMethod": "wallet",
      "paymentStatus": "completed",
      "walletTransactionId": "TXN_1703123456789"
    },
    "status": "confirmed",
    "confirmation": {
      "confirmationNumber": "CNF345678",
      "supplierConfirmation": "SUP_1703123456789",
      "voucher": "VOUCHER_1703123456789"
    },
    "metadata": {
      "source": "local",
      "bookingChannel": "web"
    },
    "createdAt": "2024-01-01T10:30:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  },
  "metadata": {
    "timestamp": "2024-01-01T10:30:00.000Z"
  }
}
```

---

## 🏗️ **Project Structure**

```
HotelService/
├── 📁 src/
│   ├── 📁 controller.Hotels/
│   │   └── 📄 hotelController.js          ← API controllers
│   ├──  services.Hotels/
│   │   └── 📄 hotelsService.js            ← Business logic
│   ├──  router.Hotels/
│   │   └── 📄 hotel.Routes.js             ← Route definitions
│   ├── 📁 utils.Hotels/
│   │   └── 📄 mockData.js                 ← Mock data
│   ├──  models.Hotels/
│   │   ├── 📄 hodels.models.js            ← Hotel schema
│   │   ├──  bookings.models.js          ← Booking schema
│   │   └── 📄 inventory.models.js         ← Inventory schema
│   ├──  config.Hotels/
│   │   └── 📄 db.js                       ← Database config
│   ├── 📄 app.js                          ← Express app setup
│   └── 📄 server.js                       ← Server entry point
├── 📄 package.json                         ← Dependencies
├── 📄 README.md                           ← Project overview
└── 📄 document.md                         ← This documentation
```

---

## 🔧 **Technical Implementation**

### **Mock Data Structure**

#### **Hotels Data**:
```javascript
{
  hotelId: "HOTEL_001",
  name: "Grand Mumbai Hotel",
  location: { city, state, country, address, coordinates },
  rating: { overall, reviews, breakdown },
  images: [urls],
  pricing: { basePrice, totalPrice, currency, breakdown },
  amenities: [amenities],
  availability: { roomsAvailable, roomType }
}
```

#### **Inventory Data**:
```javascript
{
  hotelId: "HOTEL_001",
  roomType: "Deluxe Room",
  date: "2024-08-16",
  total: 10,
  available: 8,
  booked: 2
}
```

#### **Booking Data**:
```javascript
{
  bookingId: "BK_timestamp_random",
  userId: "user_123",
  hotelInfo: { hotelId, name, address, phone },
  roomInfo: { roomType, roomCount, guestCount, bedType },
  bookingDetails: { checkInDate, checkOutDate, nights, guestDetails },
  pricing: { basePrice, taxes, fees, totalPrice, currency, breakdown },
  payment: { paymentId, paymentMethod, paymentStatus, walletTransactionId },
  status: "confirmed",
  confirmation: { confirmationNumber, supplierConfirmation, voucher },
  metadata: { source, bookingChannel },
  createdAt: Date,
  updatedAt: Date
}
```

### **Business Logic**

#### **Search Logic**:
1. **Filtering**: By location, price range, rating, amenities
2. **Sorting**: By price, rating, name (asc/desc)
3. **Pagination**: Page-based results with metadata
4. **Response**: Hotels with availability and pricing

#### **Booking Logic**:
1. **Validation**: Required fields, date validation
2. **Availability Check**: Real-time inventory verification
3. **Pricing Calculation**: Base price + taxes + fees
4. **Inventory Update**: Decrease available rooms
5. **Booking Creation**: Generate unique booking ID

#### **Availability Logic**:
1. **Date Range Check**: Verify availability for all dates
2. **Room Type Matching**: Match hotel and room type
3. **Quantity Validation**: Ensure sufficient rooms
4. **Real-time Updates**: Update inventory after booking

---

## 🚀 **Testing Guide**

### **1. Start the Server**
```bash
npm start
```

### **2. Test Search Endpoint**
```bash
curl -X POST http://localhost:3005/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"city": "Mumbai"},
    "dates": {"checkIn": "2024-08-15", "checkOut": "2024-08-17"},
    "guests": {"adults": 2, "children": 0, "rooms": 1}
  }'
```

### **3. Test Booking Endpoint**
```bash
curl -X POST http://localhost:3005/api/hotels/book \
  -H "Content-Type: application/json" \
  -d '{
    "hotelId": "HOTEL_001",
    "userId": "user_123",
    "roomDetails": {"roomType": "Deluxe Room", "roomCount": 1, "guestCount": 2},
    "dates": {"checkIn": "2024-08-16", "checkOut": "2024-08-17"},
    "guestDetails": [{"firstName": "John", "lastName": "Doe", "age": 30, "type": "primary"}]
  }'
```

### **4. Test Get Booking**
```bash
curl -X GET http://localhost:3005/api/hotels/bookings/BK_1703123456789_abc123def
```

---

## 📊 **Error Handling**

### **Common Error Responses**

#### **Validation Error**:
```json
{
  "success": false,
  "error": {
    "code": "MISSING_REQUIRED_FIELDS",
    "message": "Hotel ID, user ID, room details, dates, and guest details are required"
  }
}
```

#### **Availability Error**:
```json
{
  "success": false,
  "error": {
    "code": "BOOKING_ERROR",
    "message": "Not enough availability for 2024-08-16"
  }
}
```

#### **Date Validation Error**:
```json
{
  "success": false,
  "error": {
    "code": "BOOKING_ERROR",
    "message": "Check-in date must be from 2024 onwards"
  }
}
```

#### **Booking Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "Booking not found"
  }
}
```

---

## 🔄 **Future Enhancements**

### **Planned Features**:
1. **Database Integration**: Replace mock data with MongoDB
2. **Authentication**: JWT token-based authentication
3. **Payment Integration**: Real payment gateway integration
4. **Email Notifications**: Booking confirmations and reminders
5. **Cancellation Endpoint**: Cancel bookings with refund logic
6. **Modification Endpoint**: Modify existing bookings
7. **Reviews & Ratings**: Hotel review system
8. **Real-time Availability**: WebSocket for live updates

### **Technical Improvements**:
1. **Caching**: Redis for frequently accessed data
2. **Rate Limiting**: API rate limiting
3. **Logging**: Comprehensive logging system
4. **Testing**: Unit and integration tests
5. **Documentation**: Swagger/OpenAPI documentation
6. **Monitoring**: Health checks and metrics

---

## 📝 **Notes**

- **Mock Data**: Currently using mock data for development
- **Date Validation**: Allows dates from 2024 onwards for testing
- **Inventory Management**: Real-time inventory updates
- **Error Handling**: Comprehensive error responses
- **Response Format**: Consistent success/error response structure

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Development (Mock Data)
```

This comprehensive documentation includes:

✅ **All implemented tasks and endpoints**  
✅ **Complete API specifications with request/response examples**  
✅ **Project structure and technical implementation details**  
✅ **Testing guide with curl commands**  
✅ **Error handling documentation**  
✅ **Future enhancement roadmap**  

The document is now ready and provides a complete reference for your Hotel Service API! 