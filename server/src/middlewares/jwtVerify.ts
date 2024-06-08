import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

new Hono<{
  Bindings: {
    JWT_ACCESS_TOKEN_SECRET: string;
  };
}>();

export const jwtVerify = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader && authHeader?.startsWith("Bearer ")) {
    return c.json({ message: "No token provided" }, 401);
  }

  const cookieToken = authHeader?.split(" ")[1];

  const verifiedToken = await verify(
    cookieToken || "",
    c.env.JWT_ACCESS_TOKEN_SECRET
  );

  if (!verifiedToken) {
    return c.json({ message: "Unauthenticated" }, 401);
  }

  c.set("userId", verifiedToken.userId);
  c.set("name", verifiedToken.name);
  c.set("email", verifiedToken.email);

  await next();
});
