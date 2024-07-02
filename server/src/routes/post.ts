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

// create post
router.post("/", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const body = await c.req.parseBody();

  try {
    const {
      success,
      data: inputData,
      error,
    } = PublishPostInput.safeParse(body);

    if (!success) {
      return c.json({ message: error.message }, 403);
    }

    try {
      const foundTag = await prisma.tag.findUnique({
        where: {
          name: inputData.tag,
        },
        select: {
          name: true,
        },
      });

      if (!foundTag) {
        await prisma.tag.create({
          data: {
            name: inputData.tag,
          },
        });
      }
    } catch (error) {
      c.status(500);
      return c.text("Error creating tag!");
    }

    const uniqueName = `${inputData.image.name}${Date.now()}${Math.round(
      Math.random() * 1e9
    )}${Math.round(Math.random() * 1e4)}`;

    const imageFile = await c.env.BLOG_APP_UPLOADS.put(
      uniqueName,
      inputData.image
    );

    if (!imageFile) {
      return c.json({ message: "Error uploading image" }, 500);
    }

    // c.env.BLOG_APP_UPLOADS.delete()

    const imageUrl = `${c.env.R2_URL}/${imageFile?.key}`;

    const contentLength = inputData.content.split(" ").length;
    const readTime = Math.max(1, Math.round(contentLength / 200));

    const userDetails = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        avatar: true,
      },
    });
    if (!userDetails) {
      throw new Error("Something went wrong");
    }

    const createdPost = await prisma.post.create({
      data: {
        title: inputData.title,
        content: inputData.content,
        authorId: userId,
        authorAvatar: userDetails.avatar,
        authorName: userDetails.name,
        previewImage: imageUrl,
        readTime,
        tag: inputData.tag,
      },
    });

    if (!createdPost) {
      return c.json({ message: "Error creating post" }, 500);
    }
    return c.json({ message: "Post successfully created" }, 201);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

// single post
router.get("/get/:postId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const { postId } = c.req.param();

  try {
    const postDetails = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postDetails) {
      return c.json({ message: "Error getting post" }, 500);
    }

    return c.json(postDetails, 200);
  } catch (error) {
    return c.json({ message: error }, 500);
  }
});

// all posts
router.get("/all/:page", async (c) => {
  const prisma = c.get("prisma");
  const { page } = c.req.param();
  const pageSize = 5;
  try {
    const allPosts = await prisma.post.findMany({
      skip: (+page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });
    return c.json(allPosts, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

// user posts
router.get("/:userId/:page", async (c) => {
  const prisma = c.get("prisma");
  const { userId, page } = c.req.param();
  const pageSize = 5;

  const userAllPosts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    skip: (+page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });

  return c.json(userAllPosts);
});

router.delete("/", jwtVerify, async (c) => {
  const prisma = c.get("prisma");

  const { postId } = await c.req.json();
  if (!postId) {
    c.status(403);
    return c.text("PostId required");
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  if (!deletedPost) {
    c.status(400);
    return c.text("Error deleting post");
  }

  return c.json({ message: "Post deleted successfully" }, 200);
});

router.get("/reading-history", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  // const pageSize = 5;

  try {
    const getHistory = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        readingHistory: true,
      },
    });

    if (!getHistory) {
      throw new Error("Error getting post Ids");
    }

    const postsDetailsArray = [];

    for (const postId of getHistory?.readingHistory) {
      const postDetail = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (postDetail) postsDetailsArray.push(postDetail);
    }

    return c.json(postsDetailsArray, 200);
  } catch (error) {
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.get("/followingUserPosts");

export default router;
