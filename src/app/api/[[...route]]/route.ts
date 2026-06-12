import { Hono } from "hono";
import { handle } from "hono/vercel";
import { container } from "@/lib/container/container.prod";

const { postsController, usersController } = container;

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.get("/posts", (c) => postsController.index(c));
app.get("/posts/:postId", (c) => postsController.show(c));
app.get("/users/:userId/posts", (c) => postsController.index(c));
app.get("/users", (c) => usersController.index(c));
app.get("/users/:userId", (c) => usersController.show(c));

export const GET = handle(app);
export const POST = handle(app);
