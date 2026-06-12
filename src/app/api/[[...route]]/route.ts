import { Hono } from "hono";
import { handle } from "hono/vercel";
import { postsRouter } from "@/core/presentation/routes/posts.routes";
import { usersRouter } from "@/core/presentation/routes/users.routes";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.route("/posts", postsRouter);
app.route("/users", usersRouter);

export const GET = handle(app);
export const POST = handle(app);
