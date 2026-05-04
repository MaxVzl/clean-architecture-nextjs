import z from "zod";

export const listPostsQuerySchema = z.object({
  userId: z.string().optional(),
  titleContains: z.string().optional(),
  pagination: z
    .object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    })
    .optional(),
});

export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;
