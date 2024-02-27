import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import RazorPay from "razorpay";
import nodeCron from "node-cron";
import { Stats } from "./models/Stats.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

nodeCron.schedule("0 0 0 5 * *", async () => {
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Skillery",
      version: "1.0.0",
      description:
        "This is a simple API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.listen(process.env.PORT, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});
