import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config.Hotels/db.js";
import router from "./router.Hotels/hotel.Routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
connectDB();

app.use("/api/hotels", router);

export default app;


