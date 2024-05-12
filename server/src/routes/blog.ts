import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';
import { Variables } from 'hono/types';

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use('/*', async (c, next) => {
  try {
    const header = c.req.header('authorization') || '';
    const token = header.split(' ')[1];

    const decoded = await verify(token, c.env.JWT_SECRET);

    if (decoded) {
      c.set('userId', decoded.id);
      await next();
    }
  } catch (error) {
    c.status(403);
    return c.json({ error: 'unauthorized' });
  }
});

blogRouter.post('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const authorId = c.get('userId');

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId,
    },
  });

  return c.json({
    id: blog.id,
  });
});

blogRouter.put('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    id: blog.id,
  });
});

blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany();

    return c.json({
      blogs,
    });
  } catch (error) {
    c.status(404);
    return c.json({ message: 'Error while fetching blogs data' });
  }
});

blogRouter.get('/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  //   const body = await c.req.json();
  const bodyId = c.req.param('id');

  try {
    const blog = await prisma.post.findUnique({
      where: {
        id: bodyId,
      },
    });

    return c.json({
      id: blog,
    });
  } catch (error) {
    c.status(404);
    return c.json({ message: 'Error while fetching blog data' });
  }
});

export default blogRouter;
