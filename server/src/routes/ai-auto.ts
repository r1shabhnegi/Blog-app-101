import { Hono } from "hono";
import { OpenAIApi, Configuration } from "openai-edge";
import { AIStream, StreamingTextResponse } from "ai";

const router = new Hono<{
  Bindings: {
    OPEN_AI_SECRET_KEY: string;
  };
}>();

router.post("/", async (c) => {
  try {
    const config = new Configuration({
      // c.env.OPEN_AI_SECRET_KEY,""
    });
    const openai = new OpenAIApi(config);

    const { prompt } = await c.req.json(); // Expecting a JSON object with a 'prompt' key

    console.log(prompt);

    if (!prompt) {
      return c.text("Invalid request: 'prompt' is required", 400);
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences
                The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`,
        },
        {
          role: "user",
          content: `
            I am writing a piece of text in a notion text editor app.
            Help me complete my train of thought here: ##${prompt}##
            keep the tone of the text consistent with the rest of the text.
            keep the response short and sweet.
          `,
        },
      ],
      stream: true,
    });

    const stream = AIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return c.text("Internal Server Error", 500);
  }
});

export default router;
