import { headers } from "next/headers";
import { Session, User } from "better-auth";
import { Role } from "@/core/domain/users/enums/role.enum";
import { auth } from "@/lib/auth";

export const withAuth = async <T>(
  action: (currentSession: { session: Session; user: User }) => Promise<T>,
): Promise<T> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) {
    throw new Error("Unauthorized");
  }
  return action(session);
};

export const withRoles = async <T>(
  allowedRoles: Role[],
  action: (currentSession: { session: Session; user: User }) => Promise<T>,
): Promise<T> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) {
    throw new Error("Unauthorized");
  }

  if (!allowedRoles.includes((session.user as { role?: Role }).role as Role)) {
    throw new Error(
      "Accès refusé : Vous n'avez pas les permissions nécessaires.",
    );
  }

  return action(session);
};
