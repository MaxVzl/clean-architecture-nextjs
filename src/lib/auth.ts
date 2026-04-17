import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/core/infrastructure/database";

export const auth = betterAuth({
  baseURL: "http://localhost:3000/",
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
});
