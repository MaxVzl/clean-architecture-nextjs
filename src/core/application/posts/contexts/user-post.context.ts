import z from "zod";

export const userPostContextSchema = z.object({
  userId: z.string(),
});

export type UserPostContext = z.infer<typeof userPostContextSchema>;
