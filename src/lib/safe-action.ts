import { Role } from "@/core/domain/user/enums/role.enum";
import { getSession, verifyRoles } from "@/lib/auth";
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => error.message,
});

export const authClient = actionClient.use(async ({ next, ctx }) => {
  const session = await getSession();
  return next({ ctx: { session } });
});

export const rolesClient = (allowedRoles: Role[]) =>
  authClient.use(async ({ next, ctx }) => {
    verifyRoles(ctx.session.user, allowedRoles);
    return next({ ctx });
  });
