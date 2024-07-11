import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { Redis } from "ioredis";

new Hono<{
  Bindings: {
    REDIS_URL: string;
  };
}>();

export const redis = createMiddleware(async (c, next) => {
  const getRedisUrl = () => {
    if (c.env.REDIS_URL) {
      return c.env.REDIS_URL;
    }
  };
  const redis = new Redis(getRedisUrl());
  c.set("redis", redis);
  await next();
});
