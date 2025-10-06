import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config.Hotels/db.js";
import router from "./router.Hotels/hotel.Routes.js";
import globalError from "./middleware/errorMiddleware.js";
import responseTime from "response-time";
import client from "prom-client";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
connectDB();

const register = client.register;

client.collectDefaultMetrics({ register });
const httpRequestCounter = new client.Counter({
    name: 'http_request_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});
const httpRequestDuration = new client.Histogram({
    name: 'http_request_response_time_seconds',
    help: 'Histogram of response time for HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1],
});

app.use(responseTime((req, res, time) => {
    let routePath = req.route?.path || req.path;
    routePath = routePath.replace(/\d+/g,':id'); // Replace numbers with :id to generalize the route
    httpRequestCounter.labels(req.method, routePath, res.statusCode).inc();
    httpRequestDuration.labels(req.method, routePath, res.statusCode).observe(time / 1000); // convert to seconds
}));
app.use("/api/hotels", router);
app.get('/metrics', async (req, res) => {
    try{
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.send(metrics);
    }catch(err){
        res.status(500).send(err.message);   
    }   
});
app.use(globalError);

export default app;


