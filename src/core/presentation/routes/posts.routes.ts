import { Hono } from "hono";
import { container } from "@/lib/container/container.prod";

const { postsController } = container;

export const postsRouter = new Hono();

postsRouter.get("/", (c) => postsController.index(c));
postsRouter.get("/:postId", (c) => postsController.show(c));
