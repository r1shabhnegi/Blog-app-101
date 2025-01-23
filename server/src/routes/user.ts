import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    R2_UPLOAD: R2Bucket;
    R2_URL: string;
  };
  Variables: {
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
    userId: string;
  };
}>();

router.get("/info/:userId", async (c) => {
  const prisma = c.get("prisma");

  const { userId } = c.req.param();
  try {
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

    if (!foundUser) {
      return c.json({ message: "Error getting user" }, 500);
    }

    const countPosts = await prisma.post.count({
      where: {
        authorId: userId,
      },
    });

    return c.json({ ...foundUser, numberOfPosts: countPosts });
  } catch (error) {
    c.status(500);
    c.text(`${error || "Something went wrong!"}`);
  } finally {
    await prisma.$disconnect();
  }
});

router.get("/home-sidebar", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  try {
    // 5 Saved posts
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        post: true,
      },
    });
    const posts = savedPosts.map((savedPost) => savedPost.post);

    const mostFollowedTags = await prisma.tag.findMany({
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      take: 10,
    });

    return c.json({ posts, mostFollowedTags }, 200);
  } catch (error) {
    console.error("Error fetching sidebar info:", error);
    c.status(500);
    return c.json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  } finally {
    await prisma.$disconnect();
  }
});

// edit user info
router.patch("/edit", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const inputData = await c.req.parseBody();

  if (!inputData) {
    return c.json({ message: "Credentials not valid" }, 403);
  }

  try {
    let avatarUrl = inputData.avatar;
    const f = inputData.avatar instanceof File ? inputData.avatar.name : "";
    if (avatarUrl === "" && inputData.isAvatarRemoved === "false") {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          // avatar: avatarUrl,
          name: typeof inputData.name === "string" ? inputData.name : "",
          bio: typeof inputData.bio === "string" ? inputData.bio : "",
        },
      });

      if (!updatedUser) {
        return c.json({ message: "Error updating user" }, 500);
      }
      return c.json({ message: "User updated" }, 200);
    }

    if (inputData.isAvatarRemoved === "false" && inputData.avatar) {
      const uniqueName = `images/${userId}/${Date.now()}-${
        Math.random() * 1000
      }-${f}`;

      const avatarFile = await c.env.R2_UPLOAD.put(
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
        avatar: typeof avatarUrl === "string" ? avatarUrl : "",
        name: typeof inputData.name === "string" ? inputData.name : "",
        bio: typeof inputData.bio === "string" ? inputData.bio : "",
      },
    });

    if (!updatedUser) {
      return c.json({ message: "Error updating user" }, 500);
    }

    return c.json({ message: "User updated" }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong!"}`);
  } finally {
    await prisma.$disconnect();
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

    if (!foundUser.password) {
      c.status(500);
      return c.text("Password not found");
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
  } finally {
    await prisma.$disconnect();
  }
});

// get user about
router.get("/get-about", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
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
  } finally {
    await prisma.$disconnect();
  }
});

router.post("/add-about", jwtVerify, async (c) => {
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
  } finally {
    await prisma.$disconnect();
  }
});

// reading history
router.get("/reading-history", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { cursor } = c.req.query();
  const pageSize = 10;

  try {
    const history = await prisma.readingHistory.findMany({
      where: {
        userId,
      },
      skip: Number(cursor) ? Number(cursor) * pageSize : 0,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: true,
      },
    });

    const maxCount = 50;
    const nextCursor = !Number(cursor)
      ? 1
      : Number(cursor) <= maxCount
      ? Number(cursor) + 1
      : null;

    return c.json({ nextCursor, history }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

// add reading history
router.post("/add-history", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId } = await c.req.json();

  try {
    const history = await prisma.$transaction(async (tx) => {
      // Check for existing history
      const existingHistory = await tx.readingHistory.findFirst({
        where: {
          userId,
          postId,
        },
      });

      // Delete if exists
      if (existingHistory) {
        await tx.readingHistory.delete({
          where: {
            id: existingHistory.id,
          },
        });
      }

      // Create new history entry
      return tx.readingHistory.create({
        data: {
          userId,
          postId,
        },
      });
    });

    return c.json(history, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
