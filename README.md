# Hotel Service - Low Level Design (LLD)

## 1. Service Overview

### 1.1 Service Information
- **Service Name**: Hotel Service
- **Port**: 3005
- **Database**: MongoDB
- **Communication Protocol**: REST API + Event-Driven Messaging
- **Deployment**: Containerized (Docker + Kubernetes)

### 1.2 Core Responsibilities
- Hotel search integration with external APIs
- Room booking management
- Pricing calculations and management
- Availability tracking and validation
- Integration with wallet service for payments
- Event publishing for booking lifecycle

## 2. Detailed Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            HOTEL SERVICE ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    HTTP/HTTPS     ┌─────────────────────────────────┐  │
│  │   API Gateway   │◄──────────────────│        Load Balancer            │  │
│  │                 │                   │                                 │  │
│  └─────────────────┘                   └─────────────────────────────────┘  │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        CONTROLLER LAYER                                ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────┐  ││
│  │  │ Search        │  │ Booking       │  │ Management                │  ││
│  │  │ Controller    │  │ Controller    │  │ Controller                │  ││
│  │  │               │  │               │  │                           │  ││
│  │  │ - /search     │  │ - /book       │  │ - /bookings/{id}         │  ││
│  │  │ - /filters    │  │ - /cancel     │  │ - /bookings/user/{id}    │  ││
│  │  │ - /details    │  │ - /modify     │  │ - /bookings/history      │  ││
│  │  └───────────────┘  └───────────────┘  └───────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│           │                        │                        │               │
│           ▼                        ▼                        ▼               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        SERVICE LAYER                                   ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────┐  ││
│  │  │ Hotel Search  │  │ Booking       │  │ Pricing                   │  ││
│  │  │ Service       │  │ Service       │  │ Service                   │  ││
│  │  │               │  │               │  │                           │  ││
│  │  │ - Search Logic│  │ - Book Hotel  │  │ - Price Calculation       │  ││
│  │  │ - Filter Logic│  │ - Cancel Book │  │ - Discount Apply          │  ││
│  │  │ - Sort Logic  │  │ - Modify Book │  │ - Tax Calculation         │  ││
│  │  │ - Cache Mgmt  │  │ - Validation  │  │ - Currency Conversion     │  ││
│  │  └───────────────┘  └───────────────┘  └───────────────────────────┘  ││
│  │           │                   │                           │            ││
│  │           │                   │                           │            ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────┐  ││
│  │  │ Availability  │  │ Notification  │  │ Integration               │  ││
│  │  │ Service       │  │ Service       │  │ Service                   │  ││
│  │  │               │  │               │  │                           │  ││
│  │  │ - Room Avail  │  │ - Event Pub   │  │ - External API Calls      │  ││
│  │  │ - Inventory   │  │ - Status Sync │  │ - Data Mapping            │  ││
│  │  │ - Real-time   │  │ - Error Alert │  │ - Rate Limiting           │  ││
│  │  │ - Booking Lock│  │ - User Notify │  │ - Retry Logic             │  ││
│  │  └───────────────┘  └───────────────┘  └───────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│           │                        │                        │               │
│           ▼                        ▼                        ▼               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        REPOSITORY LAYER                                ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────┐  ││
│  │  │ Hotel         │  │ Booking       │  │ Cache                     │  ││
│  │  │ Repository    │  │ Repository    │  │ Repository                │  ││
│  │  │               │  │               │  │                           │  ││
│  │  │ - CRUD Ops    │  │ - CRUD Ops    │  │ - Redis Operations        │  ││
│  │  │ - Search Ops  │  │ - Query Ops   │  │ - Cache Management        │  ││
│  │  │ - Aggregation │  │ - Aggregation │  │ - TTL Management          │  ││
│  │  └───────────────┘  └───────────────┘  └───────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│           │                        │                        │               │
│           ▼                        ▼                        ▼               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        DATA LAYER                                      ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────┐  ││
│  │  │   MongoDB     │  │   Redis       │  │   External APIs           │  ││
│  │  │   Primary     │  │   Cache       │  │                           │  ││
│  │  │               │  │               │  │ - Booking.com API         │  ││
│  │  │ - Hotels      │  │ - Search      │  │ - Expedia API             │  ││
│  │  │ - Bookings    │  │ - Session     │  │ - Agoda API               │  ││
│  │  │ - Inventory   │  │ - Rate Limit  │  │ - Hotels.com API          │  ││
│  │  │ - Pricing     │  │ - User Data   │  │ - Local Hotel Partners    │  ││
│  │  └───────────────┘  └───────────────┘  └───────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        MESSAGING LAYER                                 ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────┐  ││
│  │  │ Event         │  │ Message       │  │ Dead Letter               │  ││
│  │  │ Publisher     │  │ Consumer      │  │ Queue                     │  ││
│  │  │               │  │               │  │                           │  ││
│  │  │ - BookingEvt  │  │ - Payment Evt │  │ - Failed Messages         │  ││
│  │  │ - CancelEvt   │  │ - Wallet Evt  │  │ - Retry Logic             │  ││
│  │  │ - ModifyEvt   │  │ - User Evt    │  │ - Error Analysis          │  ││
│  │  └───────────────┘  └───────────────┘  └───────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Component Details

### 3.1 Controller Layer

#### 3.1.1 Search Controller
**Responsibilities:**
- Handle hotel search requests
- Apply filters and sorting
- Manage pagination
- Cache search results

**Key Methods:**
- `searchHotels(searchCriteria)`
- `getHotelDetails(hotelId)`
- `getFilters(location)`
- `sortResults(sortBy, order)`

#### 3.1.2 Booking Controller
**Responsibilities:**
- Process booking requests
- Handle booking modifications
- Manage cancellations
- Validate booking data

**Key Methods:**
- `createBooking(bookingData)`
- `cancelBooking(bookingId)`
- `modifyBooking(bookingId, changes)`
- `validateBookingData(data)`

#### 3.1.3 Management Controller
**Responsibilities:**
- Retrieve booking information
- Generate booking reports
- Handle booking history
- Manage user bookings

**Key Methods:**
- `getBookingById(bookingId)`
- `getUserBookings(userId)`
- `getBookingHistory(filters)`
- `generateBookingReport(criteria)`

### 3.2 Service Layer

#### 3.2.1 Hotel Search Service
**Core Functions:**
- Aggregate results from multiple APIs
- Apply business rules and filters
- Cache frequently searched data
- Implement search optimization

**Key Algorithms:**
- Multi-source result aggregation
- Relevance scoring
- Geo-location based filtering
- Price comparison logic

#### 3.2.2 Booking Service
**Core Functions:**
- Process booking workflows
- Handle payment integration
- Manage booking state transitions
- Implement booking validations

**State Machine:**
```
[INITIATED] → [VALIDATED] → [PAYMENT_PENDING] → [CONFIRMED] → [COMPLETED]
     ↓              ↓               ↓               ↓
[CANCELLED]    [CANCELLED]    [CANCELLED]    [CANCELLED]
                                              ↓
                                        [MODIFIED] → [CONFIRMED]
```

#### 3.2.3 Pricing Service
**Core Functions:**
- Calculate dynamic pricing
- Apply discounts and promotions
- Handle currency conversions
- Manage pricing rules

**Pricing Formula:**
```
Final Price = (Base Price + Taxes + Fees) - Discounts - Cashback
```

#### 3.2.4 Availability Service
**Core Functions:**
- Check real-time availability
- Manage inventory locks
- Handle concurrent bookings
- Sync with external systems

**Concurrency Handling:**
- Distributed locks using Redis
- Optimistic locking for inventory
- Timeout-based lock releases
- Conflict resolution strategies

## 4. Data Models

### 4.1 Hotel Document Structure
```javascript
{
  _id: ObjectId,
  hotelId: String, // External API hotel ID
  name: String,
  description: String,
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: [longitude, latitude],
    zipCode: String
  },
  amenities: [String],
  rating: {
    overall: Number,
    reviews: Number,
    breakdown: {
      cleanliness: Number,
      service: Number,
      location: Number,
      value: Number
    }
  },
  images: [String],
  rooms: [{
    roomType: String,
    description: String,
    maxOccupancy: Number,
    amenities: [String],
    images: [String]
  }],
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    petPolicy: String,
    smokingPolicy: String
  },
  metadata: {
    source: String, // API source
    lastUpdated: Date,
    isActive: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Booking Document Structure
```javascript
{
  _id: ObjectId,
  bookingId: String, // Unique booking identifier
  userId: String,
  companyId: String,
  hotelInfo: {
    hotelId: String,
    name: String,
    location: Object,
    images: [String]
  },
  roomInfo: {
    roomType: String,
    roomCount: Number,
    guestCount: Number,
    bedType: String
  },
  bookingDetails: {
    checkInDate: Date,
    checkOutDate: Date,
    nights: Number,
    guestDetails: [{
      firstName: String,
      lastName: String,
      age: Number,
      type: String // primary, additional
    }]
  },
  pricing: {
    basePrice: Number,
    taxes: Number,
    fees: Number,
    discounts: Number,
    totalPrice: Number,
    currency: String,
    breakdown: [{
      date: Date,
      price: Number
    }]
  },
  payment: {
    paymentId: String,
    paymentMethod: String,
    paymentStatus: String,
    walletTransactionId: String
  },
  status: String, // initiated, confirmed, cancelled, completed, modified
  confirmation: {
    confirmationNumber: String,
    supplierConfirmation: String,
    voucher: String
  },
  cancellation: {
    cancelledAt: Date,
    reason: String,
    refundAmount: Number,
    refundStatus: String
  },
  modification: {
    modifiedAt: Date,
    changes: Object,
    additionalCharges: Number
  },
  metadata: {
    source: String,
    bookingChannel: String,
    ipAddress: String,
    userAgent: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 Inventory Document Structure
```javascript
{
  _id: ObjectId,
  hotelId: String,
  roomType: String,
  date: Date,
  availability: {
    total: Number,
    available: Number,
    booked: Number,
    blocked: Number
  },
  pricing: {
    basePrice: Number,
    currency: String,
    rateCode: String,
    restrictions: {
      minStay: Number,
      maxStay: Number,
      closeToArrival: Boolean,
      closeToDeparture: Boolean
    }
  },
  lastUpdated: Date,
  source: String
}
```

## 5. API Specifications

### 5.1 Hotel Search APIs

#### POST /hotels/search
**Request:**
```json
{
  "location": {
    "city": "Mumbai",
    "coordinates": [72.8777, 19.0760],
    "radius": 10
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
    "amenities": ["wifi", "parking", "pool"],
    "hotelTypes": ["business", "luxury"]
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

**Response:**
```json
{
  "success": true,
  "data": {
    "hotels": [
      {
        "hotelId": "hotel_123",
        "name": "Grand Mumbai Hotel",
        "location": {
          "address": "Marine Drive, Mumbai",
          "city": "Mumbai",
          "coordinates": [72.8777, 19.0760]
        },
        "rating": 4.5,
        "images": ["url1", "url2"],
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
        "amenities": ["wifi", "parking", "pool", "gym"],
        "availability": {
          "roomsAvailable": 5,
          "roomType": "Deluxe Room"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalResults": 287,
      "hasNext": true
    },
    "filters": {
      "appliedFilters": {
        "priceRange": [2000, 10000],
        "rating": [4, 5]
      },
      "availableFilters": {
        "priceRange": [1500, 25000],
        "ratings": [3, 4, 5],
        "amenities": ["wifi", "parking", "pool", "gym", "spa"]
      }
    }
  },
  "metadata": {
    "searchId": "search_123",
    "timestamp": "2024-08-01T10:30:00Z",
    "responseTime": 850
  }
}
```

### 5.2 Hotel Booking APIs

#### POST /hotels/book
**Request:**
```json
{
  "hotelId": "hotel_123",
  "userId": "user_456",
  "roomDetails": {
    "roomType": "Deluxe Room",
    "roomCount": 1,
    "guestCount": 2
  },
  "dates": {
    "checkIn": "2024-08-15",
    "checkOut": "2024-08-17"
  },
  "guestDetails": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "age": 30,
      "type": "primary"
    },
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "age": 28,
      "type": "additional"
    }
  ],
  "specialRequests": "Late check-in",
  "paymentMethod": "wallet"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "booking_789",
    "status": "confirmed",
    "confirmationNumber": "CNF123456",
    "hotelInfo": {
      "name": "Grand Mumbai Hotel",
      "address": "Marine Drive, Mumbai",
      "phone": "+91-22-12345678"
    },
    "bookingDetails": {
      "checkIn": "2024-08-15T15:00:00Z",
      "checkOut": "2024-08-17T11:00:00Z",
      "nights": 2,
      "roomType": "Deluxe Room",
      "guestCount": 2
    },
    "pricing": {
      "totalPrice": 11800,
      "currency": "INR",
      "breakdown": {
        "roomCharges": 10000,
        "taxes": 1200,
        "fees": 600
      }
    },
    "payment": {
      "paymentId": "pay_123",
      "status": "completed",
      "walletTransactionId": "txn_456"
    },
    "cancellationPolicy": {
      "cancellable": true,
      "freeUntil": "2024-08-14T18:00:00Z",
      "penalty": {
        "amount": 2000,
        "currency": "INR"
      }
    }
  },
  "metadata": {
    "bookingTimestamp": "2024-08-01T10:35:00Z",
    "processingTime": 2300
  }
}
```

## 6. Integration Points

### 6.1 External API Integration

#### 6.1.1 Booking.com Integration
```
┌─────────────────┐    HTTPS/REST    ┌─────────────────┐
│ Hotel Service   │◄─────────────────│ Booking.com API │
│                 │                  │                 │
│ - Search Hotels │   Rate Limited   │ - Hotel Data    │
│ - Get Pricing   │   (1000/min)     │ - Availability  │
│ - Book Hotel    │                  │ - Booking       │
└─────────────────┘                  └─────────────────┘
```

**Key Integration Features:**
- Real-time availability checking
- Dynamic pricing updates
- Booking confirmation handling
- Cancellation processing

#### 6.1.2 Expedia Integration
```
┌─────────────────┐    HTTPS/GraphQL  ┌─────────────────┐
│ Hotel Service   │◄─────────────────│ Expedia API     │
│                 │                  │                 │
│ - Bulk Search   │   Rate Limited   │ - Hotel Catalog │
│ - Batch Pricing │   (500/min)      │ - Inventory     │
│ - Reserve Rooms │                  │ - Reservations  │
└─────────────────┘                  └─────────────────┘
```

### 6.2 Internal Service Integration

#### 6.2.1 Wallet Service Integration
**Event Flow:**
```
Hotel Service → [BookingInitiated] → Message Queue
Message Queue → [BookingInitiated] → Wallet Service
Wallet Service → [PaymentProcessed] → Message Queue
Message Queue → [PaymentProcessed] → Hotel Service
Hotel Service → [BookingConfirmed] → Message Queue
```

#### 6.2.2 Notification Service Integration
**Event Types:**
- Booking confirmation
- Payment success/failure
- Booking modifications
- Cancellation confirmations
- Check-in reminders

## 7. Business Logic

### 7.1 Search Algorithm
```
1. Input Validation
   ├── Validate location data
   ├── Validate date range
   ├── Validate guest count
   └── Validate filter parameters

2. Multi-Source Search
   ├── Query external APIs in parallel
   ├── Apply timeout controls
   ├── Handle API failures gracefully
   └── Merge results from multiple sources

3. Result Processing
   ├── Remove duplicates
   ├── Apply business rules
   ├── Calculate pricing
   └── Apply user-specific filters

4. Sorting & Ranking
   ├── Apply relevance scoring
   ├── Consider user preferences
   ├── Apply sorting criteria
   └── Implement pagination

5. Response Preparation
   ├── Format response data
   ├── Add metadata
   ├── Cache results
   └── Return to client
```

### 7.2 Booking Workflow
```
1. Booking Initiation
   ├── Validate booking data
   ├── Check availability
   ├── Calculate final pricing
   └── Create booking record

2. Payment Processing
   ├── Initiate wallet payment
   ├── Apply booking hold
   ├── Wait for payment confirmation
   └── Handle payment failures

3. Booking Confirmation
   ├── Confirm with hotel supplier
   ├── Generate confirmation number
   ├── Update booking status
   └── Send confirmation notification

4. Post-Booking Activities
   ├── Update inventory
   ├── Schedule reminders
   ├── Update user history
   └── Process rewards/cashback
```

### 7.3 Cancellation Logic
```
1. Cancellation Request
   ├── Validate cancellation eligibility
   ├── Check cancellation policy
   ├── Calculate penalty charges
   └── Confirm cancellation intent

2. Supplier Cancellation
   ├── Cancel with hotel supplier
   ├── Obtain cancellation confirmation
   ├── Update booking status
   └── Process supplier response

3. Refund Processing
   ├── Calculate refund amount
   ├── Initiate wallet refund
   ├── Update financial records
   └── Send refund confirmation

4. Post-Cancellation Activities
   ├── Update availability
   ├── Remove scheduled reminders
   ├── Update analytics
   └── Archive booking data
```

## 8. Error Handling

### 8.1 Error Categories
- **Validation Errors**: Invalid input data
- **Business Logic Errors**: Policy violations, availability issues
- **Integration Errors**: External API failures, timeout issues
- **System Errors**: Database connectivity, service unavailability
- **Payment Errors**: Insufficient funds, payment gateway issues

### 8.2 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "HOTEL_NOT_AVAILABLE",
    "message": "Selected hotel is not available for the given dates",
    "details": {
      "hotelId": "hotel_123",
      "requestedDates": {
        "checkIn": "2024-08-15",
        "checkOut": "2024-08-17"
      },
      "availableDates": [
        {
          "checkIn": "2024-08-18",
          "checkOut": "2024-08-20"
        }
      ]
    },
    "timestamp": "2024-08-01T10:40:00Z",
    "traceId": "trace_123"
  }
}
```

### 8.3 Retry Mechanisms
- **Exponential Backoff**: For temporary failures
- **Circuit Breaker**: For recurring failures
- **Dead Letter Queue**: For permanent failures
- **Manual Intervention**: For complex issues

## 9. Performance Optimizations

### 9.1 Caching Strategy
```
┌─────────────────────────────────────────────────────────────────┐
│                     CACHING LAYERS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  L1 Cache (In-Memory)     │  L2 Cache (Redis)                  │
│  ├─── Search Results     │  ├─── Hotel Details                │
│  ├─── Hotel Data         │  ├─── Pricing Data                 │
│  ├─── User Sessions      │  ├─── Availability Data            │
│  └─── API Responses      │  └─── User Preferences             │
│                          │                                    │
│  TTL: 5-30 minutes       │  TTL: 1-24 hours                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Database Optimization
- **Indexing Strategy**: Compound indexes on search fields
- **Read Replicas**: Separate read and write operations
- **Connection Pooling**: Optimized database connections
- **Query Optimization**: Efficient aggregation pipelines

### 9.3 API Optimization
- **Request Batching**: Combine multiple API calls
- **Response Compression**: Gzip compression for responses
- **Connection Reuse**: HTTP keep-alive connections
- **Rate Limit Management**: Intelligent rate limiting

## 10. Monitoring & Observability

### 10.1 Key Metrics
- **Business Metrics**: Booking conversion rate, average booking value
- **Performance Metrics**: Response time, throughput, error rate
- **System Metrics**: CPU usage, memory utilization, disk I/O
- **Integration Metrics**: External API response times, failure rates

### 10.2 Alerting Rules
- Response time > 2 seconds
- Error rate > 5%
- External API failure rate > 10%
- Database connection pool exhaustion
- Memory usage > 85%

### 10.3 Logging Strategy
```json
{
  "timestamp": "2024-08-01T10:45:00Z",
  "level": "INFO",
  "service": "hotel-service",
  "traceId": "trace_123",
  "spanId": "span_456",
  "operation": "searchHotels",
  "userId": "user_789",
  "duration": 850,
  "status": "success",
  "metadata": {
    "searchCriteria": {
      "location": "Mumbai",
      "dates": ["2024-08-15", "2024-08-17"]
    },
    "resultCount": 25,
    "cacheHit": false
  }
}
```

## 11. Security Considerations

### 11.1 Data Protection
- **Encryption**: TLS 1.3 for data in transit
- **Data Masking**: PII data masking in logs
- **Access Control**: Role-based access to sensitive data
- **Audit Logging**: Complete audit trail for all operations

### 11.2 API Security
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Rate Limiting**: User and IP-based rate limiting
- **Input Validation**: Comprehensive input sanitization

### 11.3 Compliance
- **PCI DSS**: Payment data security
- **GDPR**: Data privacy and user rights
- **Data Retention**: Automated data cleanup policies
- **Incident Response**: Security incident handling procedures

This Low Level Design provides a comprehensive blueprint for implementing the Hotel Service microservice with proper separation of concerns, scalability considerations, and production-ready architecture.