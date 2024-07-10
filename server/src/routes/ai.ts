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

const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 200,
  temperature: 0.9,
  topP: 0.1,
  topk: 16,
};

router.post("/summary", async (c) => {
  try {
    const { text } = await c.req.json();
    console.log(text);
    const genAI = new GoogleGenerativeAI(c.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt = `I am providing you the html code, act as a world class copy writer, extract text from this html file and give me the detail summary - here is the html code - ${text}`;

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
      model: "gemini-pro",
      // generationConfig,
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
      model: "gemini-pro",
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
