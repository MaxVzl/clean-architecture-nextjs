import z from "zod";

export const listPostQuerySchema = z.object({
  titleContains: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export type ListPostQuery = z.infer<typeof listPostQuerySchema>;
