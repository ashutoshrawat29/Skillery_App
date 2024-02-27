import redis, { Redis } from "ioredis";
import { createClient } from 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 14076;


const redis_client = new Redis(
{
  host : process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password : process.env.REDIS_PASS,
}
);
redis_client.on("connect", () => {
  console.log("connected to redis successfully!");
});

redis_client.on("error", (error) => {
  console.log("Redis connection error :", error);
});

export default redis_client;
