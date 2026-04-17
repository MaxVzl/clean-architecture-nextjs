import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/core/infrastructure/database";

export const auth = betterAuth({
  baseURL: "http://localhost:3000/",
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  plugins: [admin()],
});
