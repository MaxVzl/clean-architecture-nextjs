import z from "zod";

export const listUserPostsQuerySchema = z.object({
  userId: z.string(),
  search: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type ListUserPostsQuery = z.infer<typeof listUserPostsQuerySchema>;
