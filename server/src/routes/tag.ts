import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    BLOG_APP_UPLOADS: R2Bucket;
    R2_URL: string;
  };
  Variables: {
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
    userId: string;
  };
}>();

router.post("/follow-tag/:tagId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { tagId } = c.req.param();
  console.log(`User ${userId} is trying to follow/unfollow tag ${tagId}`);
  try {
    const existingFollow = await prisma.tagFollow.findFirst({
      where: {
        userId,
        tagId,
      },
    });

    if (!existingFollow) {
      const addTag = await prisma.tagFollow.create({
        data: {
          userId,
          tagId,
        },
      });
      return c.json(
        {
          message: "Tag followed successfully",
          data: addTag,
        },
        200
      );
    } else {
      const removeTag = await prisma.tagFollow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      return c.json(
        {
          message: "Tag unfollowed successfully",
          data: removeTag,
        },
        200
      );
    }
  } catch (error: any) {
    // Check for specific Prisma errors
    if (error.code === "P2003") {
      c.status(400);
      return c.json({ error: "Invalid user or tag reference" });
    }

    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

router.get("/check-follow/:tagId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { tagId } = c.req.param();

  console.log(`Checking follow status for user ${userId} and tag ${tagId}`);

  try {
    const existingFollow = await prisma.tagFollow.findFirst({
      where: {
        tagId,
        userId,
      },
    });

    if (existingFollow) {
      return c.json({ isFollow: true }, 200);
    } else {
      return c.json({ isFollow: false }, 200);
    }
  } catch (error: any) {
    c.status(500);
    return c.json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/suggestions", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  try {
    const tags = await prisma.tag.findMany({
      take: 10,
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
          },
        },
      },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
    });

    return c.json(tags, 200);
  } catch (error: any) {
    c.status(500);
    return c.json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
