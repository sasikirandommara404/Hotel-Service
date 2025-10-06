import mongoose from "mongoose";
import logger from "../utils.Hotels/logger.js";

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            maxPoolSize:10,
            serverSelectionTimeoutMS:5000,
            socketTimeoutMS:45000

        });
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error(error.message);
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;