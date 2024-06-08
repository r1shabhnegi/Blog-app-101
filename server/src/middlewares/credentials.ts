import { createMiddleware } from "hono/factory";

export const credentials = createMiddleware(async (c, next) => {
  const allowedOrigin = c.env.FRONTEND_URL;
  const origin = c.req.header("origin");

  if (allowedOrigin === origin) {
    console.log("ys");
    c.header("Access-Control-Allow-Credentials", "true");
  }
  await next();
});
