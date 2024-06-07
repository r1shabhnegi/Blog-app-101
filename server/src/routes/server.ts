import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) => {
  return c.json({ message: "Server is up and running" }, 200);
});

export default router;
