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

// follow un-follow tag
router.post("/follow-tag/:tagId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { tagId } = c.req.param();
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
  } finally {
    await prisma.$disconnect();
  }
});

// check if followed by user
router.get("/check-follow/:tagId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { tagId } = c.req.param();

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
  } finally {
    await prisma.$disconnect();
  }
});

// top suggestions
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
  } finally {
    await prisma.$disconnect();
  }
});

// get followed tag names
router.get("/followed-tags", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  try {
    const tagsData = await prisma.tagFollow.findMany({
      where: {
        userId,
      },
      include: {
        tag: true,
      },
    });

    const tags = tagsData.map((tag) => tag.tag);

    return c.json(tags, 200);
  } catch (error: any) {
    c.status(500);
    return c.json({ error: error.message || "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

// get tag details
router.get("/detail/:tagName", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const { tagName } = c.req.param();

  try {
    const tag = await prisma.tag.findUnique({
      where: {
        name: tagName,
      },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
          },
        },
      },
    });

    return c.json(tag, 200);
  } catch (error: any) {
    c.status(500);
    return c.json({ error: error.message || "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
