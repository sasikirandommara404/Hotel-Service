import AppError from "../utils.Hotels/appError.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config({path:'../../.env'})
export const authenticate = (req, res, next) => {
    try{
        console.log(process.env.JWT_KEY)
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token) {
            throw new AppError('You are not logged in! Please log in to get access.', 401);

        }
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if(err) {
                throw new AppError('Invalid token. Please log in again!', 401);
            }
            req.user = decoded.id;
            next();
       
        })
        next();
    }catch(err) {
        next(err);
    }
    
   
}
export const authorize = (req,res,next) => {
    try{
        if(!req.user) {
            throw new AppError('Unauthorized: no user found ', 403);
        }
        if (req.user.role === 'admin') {
            throw new AppError('You do not have permission to book a room.', 403);
        }
        next();
    }catch(err){
        next(err);
    }


}
