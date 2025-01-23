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

router.get("/:postId/:page", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId, page } = c.req.param();

  const pageSize = 10;
  try {
    const getComments = await prisma.comment.findMany({
      where: {
        postId,
      },
      skip: (+page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    const commentInfo = [];
    for (const comment of getComments) {
      const author = await prisma.user.findUnique({
        where: {
          id: comment.authorId,
        },
        select: {
          name: true,
          avatar: true,
        },
      });

      if (author)
        commentInfo.push({
          ...comment,
          authorName: author.name,
          authorAvatar: author.avatar,
        });
    }

    const numberOfComments = await prisma.comment.count({
      where: {
        postId,
      },
    });

    return c.json({ numberOfComments, commentInfo }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "something went wrong"}`);
  } finally {
    await prisma.$disconnect();
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
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
