import z from "zod";

export const listMyPostsQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type ListMyPostsQuery = z.infer<typeof listMyPostsQuerySchema>;
