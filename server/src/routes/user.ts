import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { signupInput, EditUserInfoInput } from "../../../common-types/index";
import { jwtVerify } from "../middlewares/jwtVerify";
// import { parseForm } from "../middlewares/upload";
// import { v2 as cloudinary } from "cloudinary";

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

router.get("/", async (c) => {
  const prisma = c.get("prisma");
  console.log("sd");
  const img = await c.env.BLOG_APP_UPLOADS.get(
    "grass.jpeg1718020062005932707866"
  );

  return c.json(img);
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
    return c.json({ message: "Something went wrong" }, 500);
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
    return c.json({ message: error }, 500);
  }
});

export default router;
