import { Controller } from "@/core/presentation/common/controller.base";
import { getSession } from "@/lib/auth";
import { Context, Next } from "hono";

export class AuthMiddleware extends Controller<{}> {
    async authenticated(c: Context, next: Next) {
        try {
            await getSession();
            return next();
        } catch(e) {
            return c.json({ message: "Your are not authenticated" }, 401)
        }
    }
}
