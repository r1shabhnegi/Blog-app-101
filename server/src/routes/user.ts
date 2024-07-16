import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { signupInput, EditUserInfoInput } from "../../../common-types/index";
import { jwtVerify } from "../middlewares/jwtVerify";
import Redis from "ioredis";
import { redis } from "../middlewares/redis";
import { createClient } from "redis";

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    BLOG_APP_UPLOADS: R2Bucket;
    R2_URL: string;
  };
  Variables: {
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
    userId: string;
    // redis: Redis;
  };
}>();

const client = new Redis(
  "rediss://default:Ad3kAAIncDE2MjI2NGY3YTliOWE0MjRiOTAyZmYyOWMyNmQxMGQyZXAxNTY4MDQ@saving-kid-56804.upstash.io:6379"
);

// const client = createClient({
//   url: "rediss://default:Ad3kAAIncDE2MjI2NGY3YTliOWE0MjRiOTAyZmYyOWMyNmQxMGQyZXAxNTY4MDQ@saving-kid-56804.upstash.io:6379",
// });

router.get("/:userId", async (c) => {
  const prisma = c.get("prisma");
  // const redis = c.get("redis");
  // console.log(redis);
  const { userId } = c.req.param();
  console.log("userId", userId);
  try {
    // const cachedUserValue = await client.get(`user:${userId}`);
    // if (cachedUserValue) {
    //   console.log("cached Value", cachedUserValue);
    //   // return c.json({ message: { ...cachedUserValue } });
    // }
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        about: true,
        avatar: true,
        bio: true,
        createdAt: true,
        email: true,
        name: true,
      },
    });

    // const resp = await redisClient.set(
    //   `user:${userId}`,
    //   JSON.stringify(foundUser)
    // );

    if (!foundUser) {
      return c.json({ message: "Error getting user" }, 500);
    }

    const countPosts = await prisma.post.count({
      where: {
        authorId: userId,
      },
    });

    return c.json({ ...foundUser, numberOfPosts: countPosts });
    // console.log(userId);
  } catch (error) {
    c.status(500);
    c.text(`${error || "Something went wrong!"}`);
  }
});

// create user
router.post("/", async (c) => {
  const prisma = c.get("prisma");

  try {
    const body = await c.req.json();
    const { data: inputData, error: inputError } = signupInput.safeParse(body);

    if (inputError) {
      return c.json({ message: inputError.errors }, 403);
    }

    const hashedPassword = bcrypt.hashSync(inputData.password);

    const user = await prisma.user.create({
      data: {
        name: inputData.name,
        email: inputData.email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return c.json({ message: "Error registering user" }, 500);
    }

    return c.json({ message: "User registered successfully" }, 201);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong!"}`);
  }
});

// edit user info
router.patch("/", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const body = await c.req.parseBody();
  const { data: inputData, error: inputError } =
    EditUserInfoInput.safeParse(body);

  if (inputError) {
    return c.json({ message: inputError.errors }, 403);
  }

  try {
    let avatarUrl = inputData.avatar;

    if (avatarUrl === "" && inputData.isAvatarRemoved === "false") {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          // avatar: avatarUrl,
          name: inputData.name,
          bio: inputData.bio,
        },
      });

      if (!updatedUser) {
        return c.json({ message: "Error updating user" }, 500);
      }
      return c.json({ message: "User updated" }, 200);
    }

    if (
      inputData.isAvatarRemoved === "false" &&
      inputData.avatar &&
      inputData.avatar instanceof File
    ) {
      const uniqueName = `${inputData.avatar.name}${Date.now()}${Math.round(
        Math.random() * 1e9
      )}${Math.round(Math.random() * 1e4)}`;

      const avatarFile = await c.env.BLOG_APP_UPLOADS.put(
        uniqueName,
        inputData.avatar
      );

      avatarUrl = `${c.env.R2_URL}/${avatarFile?.key}`;
    } else if (inputData.isAvatarRemoved === "true") {
      avatarUrl = "";
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: avatarUrl,
        name: inputData.name,
        bio: inputData.bio,
      },
    });

    if (!updatedUser) {
      return c.json({ message: "Error updating user" }, 500);
    }

    return c.json({ message: "User updated" }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong!"}`);
  }
});

// delete user account
router.post("/delete", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { password } = await c.req.json();
  console.log(password);
  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!foundUser) {
      c.status(500);
      return c.text("something went wrong");
    }

    const isMatch = bcrypt.compareSync(password, foundUser.password);
    console.log(isMatch);
    if (!isMatch) {
      c.status(403);
      return c.text("Wrong Password!");
    }

    const deleteSavedPosts = await prisma.savedPost.deleteMany({
      where: {
        userId,
      },
    });

    const deleteUserPosts = await prisma.post.deleteMany({
      where: {
        authorId: userId,
      },
    });

    if (deleteUserPosts) {
      const deletedUser = await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    }

    return c.json({ message: "Account deleted successfully!" }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "something went wrong"}`);
  }
});

router.get("/get/countReadingHistory", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  // console.log(userId);
  console.log(userId);
  try {
    const readingHistoryPosts = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        readingHistory: true,
      },
    });

    const count = readingHistoryPosts?.readingHistory.length;
    console.log(count);
    return c.json({ count }, 200);
  } catch (error) {
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.post("/reading-history", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId } = await c.req.json();
  try {
    const count = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        readingHistory: true,
      },
    });

    if (count && +count?.readingHistory.length >= 20) {
      const newArr = count?.readingHistory.slice(11, 20);

      const newFilteredArr = newArr.filter((id) => id !== postId);

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          readingHistory: newFilteredArr,
        },
      });
    }

    const foundUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        readingHistory: {
          push: postId,
        },
      },
    });

    if (!foundUser) {
      return c.text(`something went wrong`);
    }

    return c.json({ message: "Reading history updated" });
  } catch (error) {
    return c.text(`${error || "something went wrong"}`);
  }
});

router.get("/get/saved-post/:page", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { page } = c.req.param();
  const pageSize = 5;
  try {
    const countSaved = await prisma.savedPost.count({
      where: {
        userId,
      },
    });

    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      skip: (+page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        postId: true,
      },
    });

    const savedPostArr = [];
    for (const { postId } of savedPosts) {
      const postData = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (postData) savedPostArr.push(postData);
    }

    return c.json({ countSaved, savedPosts: savedPostArr }, 200);
  } catch (error) {
    return c.text(`${error || "something went wrong"}`);
  }
});

router.get("/get/about", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  console.log("userId-", userId);
  try {
    const about = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        about: true,
      },
    });
    console.log(about);
    return c.json(about, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.post("/about", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { about } = await c.req.json();

  try {
    const aboutAdded = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        about,
      },
    });

    if (!aboutAdded) {
      return c.text("something went wrong adding user about", 500);
    }

    return c.json({ message: "done" }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

export default router;
