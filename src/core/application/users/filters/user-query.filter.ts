import z from "zod";

export const userQueryFilterSchema = z.object({
  nameContains: z.string().optional(),
  emailContains: z.string().optional(),
  pagination: z
    .object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    })
    .optional(),
});

export type UserQueryFilter = z.infer<typeof userQueryFilterSchema>;
