import { google } from "googleapis";
import { createMiddleware } from "hono/factory";

export const prismaConfigMiddleware = createMiddleware(async (c, next) => {
  c.set("prisma", prisma);
  await next();
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "postmessage");

export const oauthMiddleware = createMiddleware(async (c, next) => {
  const GOOGLE_CLIENT_ID = c.env.GOOGLE_CLIENT_ID;

  const GOOGLE_CLIENT_SECRET = c.env.GOOGLE_CLIENT_SECRET;

  const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "postmessage"
  );

  c.set("oauth2client", oauth2client);
  await next();
});
