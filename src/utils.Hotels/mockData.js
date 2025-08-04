export const hotels = [
  {
    hotelId: "HOTEL_001",
    name: "Grand Mumbai Hotel",
    location: {
      address: "Marine Drive, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      coordinates: [72.8777, 19.0760]
    },
    rating: {
      overall: 4.5,
      reviews: 1250,
      breakdown: {
        cleanliness: 4.6,
        service: 4.4,
        location: 4.8,
        value: 4.3
      }
    },
    images: [
      "https://example.com/hotel1-image1.jpg",
      "https://example.com/hotel1-image2.jpg"
    ],
    pricing: {
      basePrice: 5000,
      totalPrice: 5900,
      currency: "INR",
      breakdown: {
        basePrice: 5000,
        taxes: 600,
        fees: 300
      }
    },
    amenities: ["wifi", "parking", "pool", "gym", "spa"],
    availability: {
      roomsAvailable: 5,
      roomType: "Deluxe Room"
    }
  },
  {
    hotelId: "HOTEL_002",
    name: "Taj Palace Hotel",
    location: {
      address: "Colaba, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      coordinates: [72.8347, 18.9217]
    },
    rating: {
      overall: 4.8,
      reviews: 2100,
      breakdown: {
        cleanliness: 4.9,
        service: 4.8,
        location: 4.7,
        value: 4.6
      }
    },
    images: [
      "https://example.com/hotel2-image1.jpg",
      "https://example.com/hotel2-image2.jpg"
    ],
    pricing: {
      basePrice: 12000,
      totalPrice: 14100,
      currency: "INR",
      breakdown: {
        basePrice: 12000,
        taxes: 1440,
        fees: 660
      }
    },
    amenities: ["wifi", "parking", "pool", "gym", "spa", "restaurant", "bar"],
    availability: {
      roomsAvailable: 3,
      roomType: "Luxury Suite"
    }
  },
  {
    hotelId: "HOTEL_003",
    name: "Budget Inn",
    location: {
      address: "Andheri West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      coordinates: [72.8364, 19.1197]
    },
    rating: {
      overall: 3.8,
      reviews: 450,
      breakdown: {
        cleanliness: 3.9,
        service: 3.7,
        location: 3.8,
        value: 4.0
      }
    },
    images: [
      "https://example.com/hotel3-image1.jpg"
    ],
    pricing: {
      basePrice: 2500,
      totalPrice: 2950,
      currency: "INR",
      breakdown: {
        basePrice: 2500,
        taxes: 300,
        fees: 150
      }
    },
    amenities: ["wifi", "parking"],
    availability: {
      roomsAvailable: 8,
      roomType: "Standard Room"
    }
  }
];

export const inventory = [
  // HOTEL_001 - Deluxe Room
  {
    hotelId: 'HOTEL_001',
    roomType: 'Deluxe Room',
    date: '2024-08-15',
    total: 10,
    available: 5,
    booked: 5
  },
  {
    hotelId: 'HOTEL_001',
    roomType: 'Deluxe Room',
    date: '2024-08-16',
    total: 10,
    available: 8,
    booked: 2
  },
  {
    hotelId: 'HOTEL_001',
    roomType: 'Deluxe Room',
    date: '2024-08-17',
    total: 10,
    available: 7,
    booked: 3
  },
  {
    hotelId: 'HOTEL_001',
    roomType: 'Deluxe Room',
    date: '2025-08-17',
    total: 10,
    available: 8,
    booked: 2
  },
  {
    hotelId: 'HOTEL_001',
    roomType: 'Deluxe Room',
    date: '2025-08-18',
    total: 10,
    available: 6,
    booked: 4
  },
  {
    hotelId: 'HOTEL_001',
    roomType: 'Deluxe Room',
    date: '2025-08-19',
    total: 10,
    available: 5,
    booked: 5
  },
  
  // HOTEL_002 - Luxury Suite
  {
    hotelId: 'HOTEL_002',
    roomType: 'Luxury Suite',
    date: '2024-08-15',
    total: 5,
    available: 2,
    booked: 3
  },
  {
    hotelId: 'HOTEL_002',
    roomType: 'Luxury Suite',
    date: '2024-08-16',
    total: 5,
    available: 1,
    booked: 4
  },
  {
    hotelId: 'HOTEL_002',
    roomType: 'Luxury Suite',
    date: '2025-08-17',
    total: 5,
    available: 3,
    booked: 2
  },
  {
    hotelId: 'HOTEL_002',
    roomType: 'Luxury Suite',
    date: '2025-08-18',
    total: 5,
    available: 2,
    booked: 3
  },
  {
    hotelId: 'HOTEL_002',
    roomType: 'Luxury Suite',
    date: '2025-08-19',
    total: 5,
    available: 4,
    booked: 1
  },
  
  // HOTEL_002 - Deluxe Room
  {
    hotelId: 'HOTEL_002',
    roomType: 'Deluxe Room',
    date: '2025-08-17',
    total: 8,
    available: 5,
    booked: 3
  },
  {
    hotelId: 'HOTEL_002',
    roomType: 'Deluxe Room',
    date: '2025-08-18',
    total: 8,
    available: 4,
    booked: 4
  },
  {
    hotelId: 'HOTEL_002',
    roomType: 'Deluxe Room',
    date: '2025-08-19',
    total: 8,
    available: 6,
    booked: 2
  },
  
  // HOTEL_003 - Standard Room
  {
    hotelId: 'HOTEL_003',
    roomType: 'Standard Room',
    date: '2024-08-15',
    total: 15,
    available: 10,
    booked: 5
  },
  {
    hotelId: 'HOTEL_003',
    roomType: 'Standard Room',
    date: '2024-08-16',
    total: 15,
    available: 8,
    booked: 7
  },
  {
    hotelId: 'HOTEL_003',
    roomType: 'Standard Room',
    date: '2025-08-17',
    total: 15,
    available: 12,
    booked: 3
  },
  {
    hotelId: 'HOTEL_003',
    roomType: 'Standard Room',
    date: '2025-08-18',
    total: 15,
    available: 9,
    booked: 6
  },
  {
    hotelId: 'HOTEL_003',
    roomType: 'Standard Room',
    date: '2025-08-19',
    total: 15,
    available: 7,
    booked: 8
  }
];

export const bookings = [];