import { DomainError } from "@/core2/domain/common/errors/domain.error";

export type InvalidUuidError = DomainError<"InvalidUuid", { value: string }>;
