import { Hono } from "hono";
import { PublishPostInput } from "../../../common-types/index";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

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

router.post("/", async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const body = await c.req.parseBody();

  const { success, data: inputData, error } = PublishPostInput.safeParse(body);

  if (!success) {
    return c.json({ message: error.message }, 403);
  }

  const tags = inputData.tags.split(",");

  const createTags = async (tags: string[]) => {
    try {
      for (const tag of tags) {
        await prisma.tag.create({
          data: {
            name: tag,
          },
        });
      }
    } catch (error) {
      return c.json({ message: "Error creating tag" }, 500);
    }
  };
  createTags(tags);

  // const createdTag = prisma.tag.

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

  let readTime = 0;
  if (contentLength < 200) {
    readTime = 1;
  } else if (contentLength > 200) {
    readTime = Math.round(contentLength / 200);
  }

  const createdPost = prisma.post.create({
    data: {
      title: inputData.title,
      content: inputData.content,
      authorId: userId,
      readTime,
      previewImage: imageUrl,
      tags,

      // readTime:
    },
  });
  return c.text("sd");
});

export default router;
