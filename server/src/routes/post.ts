import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = new Hono<{
  Bindings: {
    R2_UPLOAD: R2Bucket;
    R2_URL: string;
  };
  Variables: {
    userId: string;
    email: string;
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
  };
}>();

// create post
router.post("/create", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  try {
    const inputData = await c.req.parseBody();

    // image upload
    const f = inputData["image"];
    let imageName = "";

    if (f && f instanceof File) {
      imageName = `images/${userId}/${Date.now()}-${Math.random() * 1000}-${
        f.name
      }`;
      await c.env.R2_UPLOAD.put(imageName, f);
    } else {
      c.status(400);
      return c.json({ message: "Image is required" });
    }

    if (!inputData) {
      c.status(400);
      return c.json({ message: "Credentials not valid" });
    }

    // Validate user exists
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, avatar: true },
    });

    if (!userDetails) {
      c.status(404);
      return c.json({ message: "User not found" });
    }

    // Format tag name
    const tagName =
      typeof inputData?.tag === "string"
        ? inputData.tag.toLowerCase().trim()
        : "";
    // Handle tag creation in transaction
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });

    const contentLength =
      typeof inputData.content === "string"
        ? inputData.content.split(/\s+/).length
        : 0;
    const readTime = Math.max(1, Math.ceil(contentLength / 200));

    // Create post in transaction
    const createdPost = await prisma.$transaction(async (tx) => {
      return tx.post.create({
        data: {
          title:
            typeof inputData.title === "string" ? inputData.title.trim() : "",
          content:
            typeof inputData.content === "string"
              ? inputData.content.trim()
              : "",
          authorId: userId,
          authorAvatar: userDetails.avatar,
          authorName: userDetails.name,
          previewImage: `${c.env.R2_URL}/${imageName}`,
          readTime,
          tag: tag.name,
        },
      });
    });

    return c.json(
      {
        message: "Post successfully created",
        postId: createdPost.id,
      },
      201
    );
  } catch (error) {
    console.error("Post creation error:", error);
    c.status(500);
    return c.json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  } finally {
    await prisma.$disconnect();
  }
});

// latest posts
router.get("/latest", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  const { cursor } = c.req.query();
  // console.log(cursor);
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

    return c.json({ nextCursor, posts }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

// get following posts
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

    return c.json({ nextCursor, posts }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

// get user followed tags posts
router.get("/tag", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  // const userId = c.get("userId");
  const { cursor, tag } = c.req.query();
  const pageSize = 10;

  try {
    const posts = await prisma.post.findMany({
      where: {
        tag: tag,
      },
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

    return c.json({ nextCursor, posts }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

// get single post
router.get("/single-post/:postId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const { postId } = c.req.param();
  if (!postId) {
    return c.json({ message: "Post ID is required" }, 400);
  }

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
  } finally {
    await prisma.$disconnect();
  }
});

// user posts
router.get("/user-posts/:userId", async (c) => {
  const prisma = c.get("prisma");
  const { userId } = c.req.param();
  const { cursor } = c.req.query();
  try {
    const pageSize = 10;

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
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

    return c.json({ nextCursor, posts }, 200);
  } catch (error) {
    c.status(500);
    c.json({ message: "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
});

// user saved posts
router.get("/saved-posts", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { cursor } = c.req.query();
  const pageSize = 10;
  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      skip: Number(cursor) ? Number(cursor) * pageSize : 0,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: true,
      },
    });
    const posts = savedPosts.map((savedPost) => savedPost.post);

    const maxCount = 50;
    const nextCursor = !Number(cursor)
      ? 1
      : Number(cursor) <= maxCount
      ? Number(cursor) + 1
      : null;

    return c.json({ nextCursor, posts }, 200);
  } catch (error) {
    return c.text(`${error || "something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

// delete post
router.delete("/delete", jwtVerify, async (c) => {
  const prisma = c.get("prisma");

  const { postId } = await c.req.json();

  if (!postId) {
    c.status(403);
    return c.text("PostId required");
  }
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    const deletedUrl = deletedPost.previewImage.split(c.env.R2_URL)[1];
    await c.env.R2_UPLOAD.delete(deletedUrl);

    if (!deletedPost) {
      c.status(400);
      return c.text("Error deleting post");
    }

    return c.json({ message: "Post deleted successfully" }, 200);
  } catch (error) {
    c.status(500);
    c.json({ message: "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
});

// get post stats
router.get("/stats/:postId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const { postId } = c.req.param();
  if (!postId) {
    return c.json(
      {
        success: false,
        message: "Post ID is required",
      },
      400
    );
  }

  try {
    const findStats = prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        claps: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    const isSavedByUser = prisma.savedPost.findFirst({
      where: {
        postId,
        userId,
      },
      select: {
        id: true,
      },
    });

    const [postData, isSaved] = await Promise.all([findStats, isSavedByUser]);

    if (!postData) {
      return c.json(
        {
          success: false,
          message: "Post not found",
        },
        404
      );
    }

    return c.json({
      totalClaps: postData?.claps ?? 0,
      totalComments: postData?._count.comments,
      isSavedByUser: !!isSaved,
    });
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

router.post("/like-post/:postId", jwtVerify, async (c) => {
  const prisma = c.get("prisma");
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
      await prisma.post.update({
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
  } finally {
    await prisma.$disconnect();
  }
});

// tag page posts
router.get("/tag-page/:tagId", async (c) => {
  const prisma = c.get("prisma");
  const { tagId } = c.req.param();
  const { cursor } = c.req.query();
  const pageSize = 10;

  try {
    const tagName = await prisma.tag.findUnique({
      where: {
        id: tagId,
      },
      select: {
        name: true,
      },
    });

    if (!tagName) {
      c.status(404);
      return c.json({ message: "Tag not found" });
    }

    const posts = await prisma.post.findMany({
      where: {
        tag: tagName.name,
      },
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

    return c.json({ nextCursor, posts }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
