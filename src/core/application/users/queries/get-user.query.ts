import z from "zod";

export const getUserQuerySchema = z.object({
  id: z.string(),
});

export type GetUserQuery = z.infer<typeof getUserQuerySchema>;
