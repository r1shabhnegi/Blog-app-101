import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = new Hono<{
  Bindings: {
    BLOG_APP_UPLOADS: R2Bucket;
    R2_URL: string;
  };
  Variables: {
    userId: string;
    email: string;
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
  };
}>();

router.post("/", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const { postId } = await c.req.json();
  const userId = c.get("userId");

  if (!postId) {
    return c.json(
      {
        success: false,
        message: "Post ID is required",
      },
      400
    );
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    return c.json(
      {
        success: false,
        message: "Post not found",
      },
      404
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingBookmark = await tx.savedPost.findFirst({
        where: { postId, userId },
        select: { id: true },
      });

      if (existingBookmark) {
        await tx.savedPost.delete({
          where: { id: existingBookmark.id },
        });
        return false;
      }

      await tx.savedPost.create({
        data: { postId, userId },
      });
      return true;
    });

    return c.json({ message: !!result }, 200);
  } catch (error) {
    return c.text(`${error} || something went wrong`);
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
