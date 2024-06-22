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

router.get("/:userId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { userId: userToFollowUnFollow } = c.req.param();
  try {
    console.log(userToFollowUnFollow);

    const foundFollow = await prisma.follows.findFirst({
      where: {
        followerId: userId,
        followingId: userToFollowUnFollow,
      },
      select: {
        id: true,
      },
    });

    const isFollowing = foundFollow ? true : false;

    return c.json(isFollowing, 200);
  } catch (error) {}
});

router.post("/", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  const { userId: userToFollowUnFollow } = await c.req.json();
  try {
    const foundFollow = await prisma.follows.findFirst({
      where: {
        followerId: userId,
        followingId: userToFollowUnFollow,
      },
    });

    if (!foundFollow) {
      const createFollow = await prisma.follows.create({
        data: {
          followerId: userId,
          followingId: userToFollowUnFollow,
        },
      });
    } else {
      const deletedFollow = await prisma.follows.delete({
        where: {
          id: foundFollow.id,
          followerId: userId,
          followingId: userToFollowUnFollow,
        },
      });
    }

    return c.json({ message: "done" }, 201);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

export default router;
