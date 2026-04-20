import z from "zod";

export const listPostsQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;
