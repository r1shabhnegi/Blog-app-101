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

    const tagName = inputData.tag
      ? inputData.tag.charAt(0).toUpperCase() + inputData.tag.slice(1)
      : "";

    try {
      const foundTag = await prisma.tag.findUnique({
        where: {
          name: tagName,
        },
        select: {
          name: true,
        },
      });

      if (!foundTag) {
        await prisma.tag.create({
          data: {
            name: tagName,
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

//delete post
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

  await c.env.BLOG_APP_UPLOADS.delete(deletedPost.previewImage);

  if (!deletedPost) {
    c.status(400);
    return c.text("Error deleting post");
  }

  return c.json({ message: "Post deleted successfully" }, 200);
});

// history
router.get("/reading-history", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

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
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.get("/get/stats/:postId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId } = c.req.param();
  console.log(postId);
  try {
    const countClaps = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        claps: true,
      },
    });

    const countComments = await prisma.comment.count({
      where: {
        postId,
      },
    });

    return c.json({
      totalClaps: countClaps?.claps,
      totalComments: countComments,
    });
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.post("/likePost/:postId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId } = c.req.param();
  try {
    const foundPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        claps: true,
      },
    });

    if (foundPost) {
      const likedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          claps: foundPost?.claps + 1,
        },
      });
    }

    return c.json({ message: "done" }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.get("/get/five/posts", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  console.log("userId-", userId);
  try {
    const fivePosts = await prisma.savedPost.findMany({
      where: {
        userId,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const postsData = [];
    for (const post of fivePosts) {
      const postData = await prisma.post.findUnique({
        where: {
          id: post.postId,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          readTime: true,
          authorAvatar: true,
        },
      });
      if (postData) postsData.push(postData);
    }

    return c.json(postsData, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.get("/latest", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  const { cursor } = c.req.query();
  console.log(cursor);
  const pageSize = 10;

  try {
    const posts = await prisma.post.findMany({
      skip: Number(cursor) ? Number(cursor) * pageSize : 0,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    const maxCount = 50;
    const nextCursor = !Number(cursor)
      ? 1
      : Number(cursor) <= maxCount
      ? Number(cursor) + 1
      : null;

    return c.json({ nextCursor, result: posts }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.get("/following", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  const { cursor } = c.req.query();
  console.log(cursor);
  const pageSize = 10;

  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          following: {
            some: {
              followerId: userId,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(posts);

    const maxCount = 50;
    const nextCursor = !Number(cursor)
      ? 1
      : Number(cursor) <= maxCount
      ? Number(cursor) + 1
      : null;

    return c.json({ nextCursor, result: posts }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

export default router;
