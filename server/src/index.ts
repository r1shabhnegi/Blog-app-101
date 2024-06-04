import { Hono } from 'hono';
import { cors } from 'hono/cors';
import serverRouter from './routes/server';
import userRouter from './routes/user';
import postRouter from './routes/post';
import commentRouter from './routes/comment';
import tagRouter from './routes/tag';

const app = new Hono();

app.use(cors());

app.route('/', serverRouter);
app.route('/api/v1/user', userRouter);
app.route('/api/v1/post', postRouter);
app.route('/api/v1/comment', commentRouter);
app.route('/api/v1/tag', tagRouter);

export default app;
