import { InvalidUuidError } from "@/core2/domain/common/errors/uuid.error";
import { UserNotFoundError } from "@/core2/domain/user/errors/user.errors";

export type CreatePostError = InvalidUuidError | UserNotFoundError;
