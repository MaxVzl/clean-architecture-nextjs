import { notFoundResponse } from "@/core/presentation/common/errors.type";
import z from "zod";

export const singleItemResponse = <T extends z.ZodType>(
  schema: T,
  description: string,
) => ({
  200: {
    content: { "application/json": { schema } },
    description,
  },
  404: notFoundResponse,
});
