import z from "zod";

export const listUserQuerySchema = z.object({
  nameContains: z.string().optional(),
  emailContains: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export type ListUserQuery = z.infer<typeof listUserQuerySchema>;
