import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { jwtVerify } from "../middlewares/jwtVerify";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

const router = new Hono<{
  Bindings: {
    BLOG_APP_UPLOADS: R2Bucket;
    R2_URL: string;
    GOOGLE_API_KEY: string;
  };
  Variables: {
    userId: string;
    email: string;
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
  };
}>();

router.post("/ask-ai", async (c) => {
  try {
    const { text: htmlText } = await c.req.json();
    function stripHtml(html: string) {
      return html
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim(); // Remove leading/trailing spaces
    }

    const text = stripHtml(htmlText);
    const chat = new ChatGoogleGenerativeAI({
      apiKey: c.env.GOOGLE_API_KEY,
      model: "gemini-1.5-flash-8b",
    });

    const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
      "Act as a world class general knowledge champion and make things simplified for me"
    );

    const humanMessagePrompt =
      HumanMessagePromptTemplate.fromTemplate("{text}");

    const chatPrompt = ChatPromptTemplate.fromMessages([
      systemMessagePrompt,
      humanMessagePrompt,
    ]);

    const formattedChatPrompt = await chatPrompt.formatMessages({ text });

    const response = await chat.invoke(formattedChatPrompt);

    return c.json({ text: response.content }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

// summary
router.post("/summary", async (c) => {
  try {
    const { text: htmlText } = await c.req.json();
    function stripHtml(html: string) {
      return html
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim(); // Remove leading/trailing spaces
    }

    const text = stripHtml(htmlText);
    const chat = new ChatGoogleGenerativeAI({
      apiKey: c.env.GOOGLE_API_KEY,
      model: "gemini-1.5-flash-8b",
    });

    const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
      "Act as a world-class blog writer and editor, Summarize the key points of the content and if appropriate, create a bulleted list of the main ideas."
    );

    const humanMessagePrompt =
      HumanMessagePromptTemplate.fromTemplate("{text}");

    const chatPrompt = ChatPromptTemplate.fromMessages([
      systemMessagePrompt,
      humanMessagePrompt,
    ]);

    const formattedChatPrompt = await chatPrompt.formatMessages({ text });

    const response = await chat.invoke(formattedChatPrompt);

    return c.json({ text: response.content }, 200);
  } catch (error) {
    c.status(500);
    return c.text(`${error || "Something went wrong"}`);
  }
});

export default router;
