import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { signupInput, EditUserInfoInput } from "../../../common-types/index";
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

router.get("/:userId", async (c) => {
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

router.post("/reading-history", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId } = await c.req.json();
  console.log(postId);
  try {
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
    console.log(foundUser);
    if (!foundUser) {
      return c.text(`something went wrong`);
    }

    return c.json({ message: "Reading history updated" });
  } catch (error) {
    return c.text(`${error || "something went wrong"}`);
  }
});

export default router;
