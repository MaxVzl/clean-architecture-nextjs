import z from "zod";

export const jsonBody = <T extends z.ZodType>(schema: T) => ({
  content: { "application/json": { schema } },
});
