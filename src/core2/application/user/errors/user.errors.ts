import { InvalidUuidError } from "@/core2/domain/common/errors/uuid.error";
import { InvalidEmailError } from "@/core2/domain/user/errors/email.error";

export type CreateUserError = InvalidEmailError | InvalidUuidError;
