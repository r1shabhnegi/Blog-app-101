import { Hono } from "hono";
import { cors } from "hono/cors";
import { prismaConfigMiddleware } from "./middlewares/prisma";
import serverRouter from "./routes/server";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";
import tagRouter from "./routes/tag";
import authRouter from "./routes/auth";

const app = new Hono();

// app.use(credentials);
app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));
app.use("/api/v1/*", prismaConfigMiddleware);

app.route("/", serverRouter);
app.route("/api/v1/auth", authRouter);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);
app.route("/api/v1/comment", commentRouter);
app.route("/api/v1/tag", tagRouter);
export default app;
