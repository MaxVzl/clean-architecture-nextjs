import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { handle } from "hono/vercel";

import { postRouter } from "@/core/presentation/routers/post.router";
import { userRouter } from "@/core/presentation/routers/user.router";

const app = new OpenAPIHono()
  .basePath("/api")
  .doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My API",
    },
  })
  .get("/scalar", Scalar({ url: "/api/doc" }))
  .get("/hello", (c) => {
    return c.json({
      message: "Hello Next.js!",
    });
  })
  .route("/posts", postRouter)
  .route("/users", userRouter);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
