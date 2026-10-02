import type { ApplicationError } from "./application.error";

export type EmailError = ApplicationError<"EmailError", { value: string }>;
