import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { handle } from "hono/vercel";
import { postRouter } from "@/core/presentation/routers/post.router";
import { userRouter } from "@/core/presentation/routers/user.router";

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

app.route("/posts", postRouter);
app.route("/users", userRouter);

export const GET = handle(app);
export const POST = handle(app);
