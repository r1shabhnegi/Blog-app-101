import { Hono } from "hono";
import { cors } from "hono/cors";
import { prismaConfigMiddleware } from "./middlewares/prisma";
import serverRouter from "./routes/server";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";
import tagRouter from "./routes/tag";
import authRouter from "./routes/auth";
import bookmarkRouter from "./routes/bookmark";
import followRouter from "./routes/follow";
import aiRouter from "./routes/ai";
// import { redis } from "./middlewares/redis";

const app = new Hono().basePath("/api/v1");

// app.use(credentials);
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://readpool-2dqfltslh-rishabhs-projects-600a8bfe.vercel.app",
    ],
  })
);
app.use("/api/v1/*", prismaConfigMiddleware);
// app.use("/api/v1/*", redis);

app.route("/server", serverRouter);
app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/post", postRouter);
app.route("/bookmark", bookmarkRouter);
app.route("/comment", commentRouter);
app.route("/tag", tagRouter);
app.route("/follow", followRouter);
app.route("/ai", aiRouter);

export default app;
