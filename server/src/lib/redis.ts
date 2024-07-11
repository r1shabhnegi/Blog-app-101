import { Context } from "hono";
import Redis from "ioredis";

const getRedisUrl = (c: Context) => {
  if (c.env.REDIS_URL) {
    return c.env.REDIS_URL;
  }

  throw new Error("REDIS_URL is not defined");
};

// export const redis = new Redis(getRedisUrl(c));
