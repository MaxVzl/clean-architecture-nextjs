import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { handle } from "hono/vercel";
import { postsRouter } from "@/core/presentation/routes/posts.routes";
import { usersRouter } from "@/core/presentation/routes/users.routes";
import { AuthMiddleware } from "@/core/presentation/middlewares/auth.middleware";

const app = new OpenAPIHono().basePath("/api");

app.get("/scalar", Scalar({ url: "/api/doc" }));

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

// app.use((c, next) => new AuthMiddleware({}).authenticated(c, next))

app.route("/posts", postsRouter);
app.route("/users", usersRouter);

export const GET = handle(app);
export const POST = handle(app);
