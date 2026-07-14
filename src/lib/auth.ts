import { betterAuth, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { headers } from "next/headers";

import { Role } from "@/core/domain/user/enums/role.enum";
import {
  account,
  session,
  user,
  verification,
} from "@/core/infrastructure/auth/schemas/drizzle-auth.schema";
import { db } from "@/core/infrastructure/database";
import { authNotifierService } from "@/lib/container";

export const auth = betterAuth({
  baseURL: "http://localhost:3000/",
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ url, user }) => {
      await authNotifierService.notifyPasswordReset({
        to: user.email,
        url,
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  plugins: [admin()],
});

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) {
    throw new Error("Unauthorized");
  }
  return session;
};

export const verifyRoles = (user: User, allowedRoles: Role[]) => {
  const userRole = (user as { role?: Role }).role;
  if (!allowedRoles.includes(userRole as Role)) {
    throw new Error(
      "Accès refusé : Vous n'avez pas les permissions nécessaires.",
    );
  }
};
