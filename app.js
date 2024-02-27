import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan"
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

config({
  path: "./config/config.env",
});
const app = express();

// Using Middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true},{limit: '50mb'}));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Morgan
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logs=fs.createWriteStream(path.join(__dirname,'./access.logs'),{flags: 'a'})
app.use(morgan('combined', { stream: logs }));


// Importing & Using Routes
import course from "./routes/courseRoutes.js";
import user from "./routes/userRoutes.js";
import payment from "./routes/paymentRoutes.js";
import other from "./routes/otherRoutes.js";

app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);
app.use("/api/v1", other);

export default app;

app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);

app.use(ErrorMiddleware);
