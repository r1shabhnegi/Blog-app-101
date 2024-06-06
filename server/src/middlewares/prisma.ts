import { createMiddleware } from "hono/factory";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prismaConfigMiddleware = createMiddleware(async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  c.set("prisma", prisma);
  await next();
});
