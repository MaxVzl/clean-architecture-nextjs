import { Session, User } from "better-auth";
import type { ReactNode } from "react";

import { Role } from "@/core/domain/user/enums/role.enum";
import { getSession, verifyRoles } from "@/lib/auth";

type AuthSession = { session: Session; user: User };

export function withAuth(component: (auth: AuthSession) => ReactNode) {
  return async function AuthenticatedPage() {
    const auth = await getSession();
    return component(auth);
  };
}

export function withRoles(
  roles: Role[],
  component: (auth: AuthSession) => ReactNode,
) {
  return async function AuthenticatedWithRolesPage() {
    const auth = await getSession();
    verifyRoles(auth.user, roles);
    return component(auth);
  };
}
