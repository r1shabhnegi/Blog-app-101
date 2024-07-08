import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    FRONTEND_URL: string;
  };
  Variables: {
    userId: string;
    email: string;
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
  };
}>();

router.get("/:postId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId } = c.req.param();
  try {
    const getComments = await prisma.comment.findMany({
      where: {
        postId,
      },
    });

    // const author = await prisma.user.findUnique({
    //   where: {
    //     id: getComments,
    //   },
    // });

    return c.json(comments, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "something went wrong"}`);
  }
});

router.post("/", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId, content } = await c.req.json();
  console.log(postId, content);
  try {
    const foundAuthor = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (foundAuthor) {
      const createdComment = await prisma.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });
    }

    return c.json({ message: "done" }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "something went wrong"}`);
  }
});

export default router;
