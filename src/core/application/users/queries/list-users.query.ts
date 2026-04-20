import z from "zod";

export const listUsersQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
