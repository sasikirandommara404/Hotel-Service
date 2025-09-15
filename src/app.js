import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config.Hotels/db.js";
import router from "./router.Hotels/hotel.Routes.js";
import globalError from "./middleware/errorMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
connectDB();

app.use("/api/hotels", router);
app.use(globalError);

export default app;


