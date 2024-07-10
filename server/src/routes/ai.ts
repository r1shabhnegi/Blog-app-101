import { GoogleGenerativeAI } from "@google/generative-ai";
import { Hono } from "hono";
import { PublishPostInput } from "../../../common-types/index";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = new Hono<{
  Bindings: {
    BLOG_APP_UPLOADS: R2Bucket;
    R2_URL: string;
    GEMINI_KEY: string;
  };
  Variables: {
    userId: string;
    email: string;
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
  };
}>();

router.post("/summary", async (c) => {
  try {
    const { text } = await c.req.json();
    console.log(text);
    const genAI = new GoogleGenerativeAI(c.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `I am providing you the html code, act as a world class copy writer, extract text from this html file and give me the summary - here the code - ${text}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log("response", response);
    return c.json({ text: response }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

export default router;
