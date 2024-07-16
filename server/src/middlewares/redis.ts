import { Context, Hono, Next } from "hono";
import { createMiddleware } from "hono/factory";
import Redis from "ioredis";

export const app = new Hono<{
  Bindings: {
    REDIS_URL: string;
  };
  Variables: {
    redis: Redis;
  };
}>();

let redisClient: Redis | null = null;

export const redis = createMiddleware(async (c, next) => {
  console.log("Redis middleware started");
  if (!redisClient) {
    const redisUrl = c.env.REDIS_URL;
    if (!redisUrl) {
      console.log("REDIS_URL not set");
      return c.text("REDIS_URL is not set", 500);
    }
    console.log("Creating new Redis client");
    redisClient = new Redis(redisUrl);
  }

  c.set("redis", redisClient);

  try {
    console.log("Calling next middleware");
    await next();
    console.log("Next middleware completed");
  } catch (error) {
    console.error("Error in Redis middleware:", error);
    // if (!c.res.writable) {
    //   console.log("Response not writable, sending 500");
    //   return c.text("Internal Server Error", 500);
    // }
  } finally {
    console.log("Redis middleware completed");
  }
});
