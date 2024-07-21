import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
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

router.post("/summary", jwtVerify, async (c) => {
  try {
    const { text } = await c.req.json();
    const genAI = new GoogleGenerativeAI(c.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `You are a world-class copywriter. I'm providing you with HTML code. Please:

1. Extract all relevant text content from this HTML.
2. Summarize the key points of the extracted content.
3. If appropriate, create a bulleted list of the main ideas.

Here is the HTML code:

${text}

Please provide your summary and/or bullet points based on the content.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log("response", response);
    return c.json({ text: response }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.post("/ask-ai", async (c) => {
  try {
    const { text } = await c.req.json();
    const genAI = new GoogleGenerativeAI(c.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `Act as a amazing general knowledge champion and make things simplified for me, the question is - ${text}`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return c.json({ text: response }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

router.post("/extend", async (c) => {
  try {
    const { text } = await c.req.json();
    const genAI = new GoogleGenerativeAI(c.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // generationConfig,
    });
    const prompt = `I am providing you a paragraph, act as a world class writer and extend this paragraph according to it, paragraph - ${text}`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return c.json({ text: response }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

export default router;
