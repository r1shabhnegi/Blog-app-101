import { createMiddleware } from "hono/factory";
const jwtVerify = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("authentication");

  next();
});
