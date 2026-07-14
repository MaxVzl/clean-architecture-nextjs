import { MiddlewareHandler } from "hono";

import { Middleware } from "@/core/presentation/common/middleware.base";
import { getSession } from "@/lib/auth";

export class AuthMiddleware extends Middleware<void> {
  handle: MiddlewareHandler = async (c, next) => {
    const session = await getSession();
    c.set("session", session);
    return next();
  };
}
