import { betterAuth, User } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/core/infrastructure/database";
import {
  account,
  session,
  user,
  verification,
} from "@/core/infrastructure/database/schemas/auth.schema";
import { headers } from "next/headers";
import { Role } from "@/core/domain/users/enums/role.enum";

export const auth = betterAuth({
  baseURL: "http://localhost:3000/",
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ token, url, user }) => {
      console.log("[auth] password reset — token:", token);
      console.log("[auth] password reset — url:", url, "user:", user.email);
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
