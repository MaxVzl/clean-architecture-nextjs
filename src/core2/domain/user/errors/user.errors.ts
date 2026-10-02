import { DomainError } from "@/core2/domain/common/errors/domain.error";

export type UserNotFoundError = DomainError<
  "UserNotFound",
  { identifier: string }
>;
