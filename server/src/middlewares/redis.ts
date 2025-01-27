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
  if (!redisClient) {
    const redisUrl = c.env.REDIS_URL;
    if (!redisUrl) {
      console.log("REDIS_URL not set");
      return c.text("REDIS_URL is not set", 500);
    }
    redisClient = new Redis(redisUrl);
  }

  c.set("redis", redisClient);

  try {
    await next();
  } catch (error) {
    // if (!c.res.writable) {
    //   console.log("Response not writable, sending 500");
    //   return c.text("Internal Server Error", 500);
    // }
  } finally {
    console.log("Redis middleware completed");
  }
});
