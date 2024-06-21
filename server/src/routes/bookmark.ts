import { Hono } from "hono";
import { PublishPostInput } from "../../../common-types/index";
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

  try {
    const isSavedPost = await prisma.savedPost.findFirst({
      where: {
        postId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (isSavedPost) {
      const removeSavedPost = await prisma.savedPost.delete({
        where: {
          id: isSavedPost.id,
        },
      });
    } else {
      const savedPost = await prisma.savedPost.create({
        data: {
          postId,
          userId,
        },
      });
    }

    return c.json({ message: "bookmark handled" }, 200);
  } catch (error) {
    return c.text(`${error} || something went wrong`);
  }
});

router.get("/:postId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId } = c.req.param();
  console.log(postId);
  try {
    const isSavedPost = await prisma.savedPost.findFirst({
      where: {
        postId,
        userId,
      },
      select: {
        id: true,
      },
    });
    const isBookmarked = isSavedPost ? true : false;
    return c.json(isBookmarked, 200);
  } catch (error) {
    return c.text(`${error} || something went wrong`);
  }
});

export default router;
