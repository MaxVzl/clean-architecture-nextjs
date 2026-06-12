import { Hono } from "hono";
import { container } from "@/lib/container/container.prod";

const { usersController, postsController } = container;

export const usersRouter = new Hono();

usersRouter.get("/", (c) => usersController.index(c));
usersRouter.get("/:userId/posts", (c) => postsController.index(c));
usersRouter.get("/:userId", (c) => usersController.show(c));
