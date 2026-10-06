import { NotFoundError } from "@/core/domain/common/errors/not-found.error";

interface UserNotFoundErrorProps {
  identifier: string;
}

export class UserNotFoundError extends NotFoundError {
  constructor({ identifier }: UserNotFoundErrorProps) {
    super({ code: "USER_NOT_FOUND", resource: "User", identifier });
  }
}
