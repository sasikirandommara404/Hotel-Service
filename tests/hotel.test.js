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
describe("test hotel services controlles",()=>{
    it("it fetch available hotes",async ()=>{
        const response = await request(app)
        .post('/api/hotels/search')
        .set('Authorization',`Bearer ${token}`)
        .send({
            "location": "Mumbai",
            "dates": {
                "checkIn": "2025-09-22",
                "checkOut": "2025-09-27"
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
                "checkIn": "2025-09-22",
                "checkOut": "2025-09-27"
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



