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

router.get("/names", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  try {
    const tagNames = await prisma.tag.findMany({
      orderBy: {
        id: "asc",
      },
      take: 10,
      skip: 0,
    });
    return c.json(tagNames);
  } catch (error) {}
});

router.get("/get/:name/:page", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const { name, page } = c.req.param();

  const pageSize = 10;
  try {
    const countTagPosts = await prisma.post.count({
      where: {
        tag: name,
      },
    });

    const allTagPosts = await prisma.post.findMany({
      where: {
        tag: name,
      },
      skip: (+page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ countTagPosts, posts: allTagPosts });
  } catch (error) {}
});

export default router;
