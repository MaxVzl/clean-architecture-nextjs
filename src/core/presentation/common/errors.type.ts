import z from "zod";

export const notFoundResponse = {
  description: "Resource not found",
} as const;

export const unauthorizedResponse = {
  description: "Unauthorized",
} as const;

export const forbiddenResponse = {
  description: "Forbidden - insufficient permissions",
} as const;

export const validationErrorResponse = {
  description: "Invalid request data",
} as const;

export const paginatedHeaders = z.object({
  "X-Total-Count": z.number(),
});
