import request from 'supertest';
import app from '../src/app.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
let bookingId;

dotenv.config({path:'../.env'});
let token = jwt.sign(
    {
        id:1,
        role:'user'
    },
    process.env.JWT_KEY,
    {
        expiresIn:'24h'
    }
)

// Helper function to get future dates
const getFutureDates = () => {
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 30); // 30 days from now
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 5); // 5 days after check-in
    
    return {
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0]
    };
};

describe("test hotel services controlles",()=>{
    it("it fetch available hotes",async ()=>{
        const dates = getFutureDates();
        
        const response = await request(app)
        .post('/api/hotels/search')
        .set('Authorization',`Bearer ${token}`)
        .send({
            "location": "Mumbai",
            "dates": {
                "checkIn": dates.checkIn,
                "checkOut": dates.checkOut
            },
            "guests": {
                "adults": 2,
                "children": 0,
                "rooms": 1
            }
        })
        
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBeTruthy()
        expect(response.body).toHaveProperty('data')


    });
    it("it provide booking id",async ()=>{
        const dates = getFutureDates();
        
        const response = await request(app)
        .post('/api/hotels/book')
        .set('Authorization',`Bearer ${token}`)
        .send({
            "hotelId": "HOTEL_002",
            "userId": "user_123",
            "roomDetails": {
                "roomType": "Luxury Suite",
                "roomCount": 1,
                "guestCount": 2
            },
            "dates": {
                "checkIn": dates.checkIn,
                "checkOut": dates.checkOut
            },
            "guestDetails": [
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "age": 30,
                "type": "primary"
                }
            ]
        })
        bookingId=response.body.data.bookingId
        expect(response.statusCode).toBe(201)
        expect(response.body.success).toBeTruthy()
        expect(response.body).toHaveProperty('data')
    
    })
    it("it fetch booking id",async ()=>{
        const response = await request(app)
        .get(`/api/hotels/bookings/${bookingId}`)
        .set('Authorization',`Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBeTruthy()
        expect(response.body).toHaveProperty('data')
    })


        
})