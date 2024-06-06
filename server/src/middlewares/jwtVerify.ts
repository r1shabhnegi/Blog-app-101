import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

new Hono<{
  Bindings: {
    JWT_ACCESS_TOKEN_SECRET: string;
  };
}>();

export const jwtVerify = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("authentication");
  if (!authHeader) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authHeader?.split(" ")[1];

  const verifiedToken = await verify(
    token || "",
    c.env.JWT_ACCESS_TOKEN_SECRET
  );

  if (!verifiedToken) {
    return c.json({ message: "Unauthenticated" }, 403);
  }

  c.set("userId", verifiedToken.userId);
  c.set("name", verifiedToken.name);
  c.set("email", verifiedToken.email);

  await next();
});
