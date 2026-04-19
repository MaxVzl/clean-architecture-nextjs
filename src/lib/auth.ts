import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/core/infrastructure/database";
import {
  account,
  session,
  user,
  verification,
} from "@/core/infrastructure/database/schemas/auth.schema";

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
