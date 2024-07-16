import { createMiddleware } from "hono/factory";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://your-production-domain.com",
];

function isAllowedOrigin(origin: any) {
  return ALLOWED_ORIGINS.includes(origin);
}

export const corsMiddleware = createMiddleware(async (c, next) => {
  const origin = c.req.header("origin");
  if (origin && isAllowedOrigin(origin)) {
    // c.res.headers.set("Access-Control-Allow-Origin", origin);
    c.res.headers.set("Access-Control-Allow-Credentials", "true");
    // c.res.headers.set(
    //   "Access-Control-Allow-Methods",
    //   "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    // );
    // c.res.headers.set(
    //   "Access-Control-Allow-Headers",
    //   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    // );

    // Handle preflight requests
    // if (c.req.method === "OPTIONS") {
    //   c.status(204);
    //   return;
    // }
  }

  await next();
});
