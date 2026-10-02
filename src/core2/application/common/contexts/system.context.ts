import z from "zod";

export const systemContextSchema = z.object({
  userId: z.string(),
});

export type SystemContext = z.infer<typeof systemContextSchema>;
