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

// isFollowing?
router.get("/:userId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { userId: userToFollowUnFollow } = c.req.param();
  try {
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

// count followers
router.get("/followers-count/:userId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  //   const userId = c.get("userId");
  const { userId } = c.req.param();
  try {
    const followerCount = await prisma.follows.count({
      where: {
        followingId: userId,
      },
    });

    return c.json({ followerCount }, 200);
  } catch (error) {
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.get("/get/five-following/:userId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  // const userId = c.get("userId");
  const { userId } = c.req.param();

  try {
    const foundFiveFollowing = await prisma.follows.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
      take: 5,
      orderBy: {
        id: "desc",
      },
    });

    const fiveFollowing = [];

    for (const userId of foundFiveFollowing) {
      try {
        const userData = await prisma.user.findUnique({
          where: {
            id: userId.followingId,
          },
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        });

        if (userData) {
          fiveFollowing.push(userData);
        }
      } catch (error) {
        return c.text(`${error || "Something went wrong"}`);
      }
    }

    return c.json(fiveFollowing, 200);
  } catch (error) {
    return c.text(`${error || "Something went wrong"}`);
  }
});

// create follow
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

router.get("/followers/:userId/:page", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const { userId, page } = c.req.param();

  const pageSize = 10;

  try {
    const followers = await prisma.follows.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
      skip: (+page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
    });

    const getFollowersData = async (users: { followerId: string }[]) => {
      try {
        const usersArr: any[] = [];
        for (const { followerId } of users) {
          const userData = await prisma.user.findUnique({
            where: {
              id: followerId,
            },
            select: {
              id: true,
              avatar: true,
              name: true,
              bio: true,
            },
          });

          if (userData) {
            usersArr.push(userData);
          } else {
            console.log(`User not found for follower with ID ${followerId}`);
          }
        }

        return usersArr;
      } catch (error) {
        console.error(
          `Error fetching user data: ${error || "Something went wrong"}`
        );
        throw error; // Rethrow the error or handle it further
      }
    };

    // Example usage:
    const usersData = await getFollowersData(followers);
    console.log("Users data:", usersData);

    return c.json(usersData, 200);
  } catch (error) {
    return c.text(`${error || "Something went wrong"}`);
  }
});

export default router;
