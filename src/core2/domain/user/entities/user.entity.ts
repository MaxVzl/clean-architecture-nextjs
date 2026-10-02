import { ok, Result } from "neverthrow";

import { InvalidUuidError } from "@/core2/domain/common/errors/uuid.error";
import {
  generateUUID,
  UUID,
} from "@/core2/domain/common/value-objects/uuid.vo";
import { Role } from "@/core2/domain/user/enums/role.enum";
import { InvalidEmailError } from "@/core2/domain/user/errors/email.error";
import { Email, makeEmail } from "@/core2/domain/user/value-objects/email.vo";

export type User = {
  readonly id: UUID;
  readonly name: string;
  readonly email: Email;
  readonly role: Role;
  readonly image: string | null;
  readonly emailVerified: boolean;
};

export const createUser = (input: {
  name: string;
  email: string;
  role: Role;
}): Result<User, InvalidUuidError | InvalidEmailError> => {
  return Result.combine([generateUUID(), makeEmail(input.email)]).andThen(
    ([id, email]) => {
      return ok({
        id,
        name: input.name,
        email,
        role: input.role,
        image: null,
        emailVerified: false,
      });
    },
  );
};
