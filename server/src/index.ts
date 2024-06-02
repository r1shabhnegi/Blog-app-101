import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.get('/', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  prisma.user.findFirst({
    where: {
      name: 'rishabh',
    },
  });

  return c.text('Hello Hono!');
});

export default app;
