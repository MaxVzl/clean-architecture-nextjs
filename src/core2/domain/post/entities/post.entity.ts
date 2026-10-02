import { ok, Result } from "neverthrow";

import { InvalidUuidError } from "@/core2/domain/common/errors/uuid.error";
import {
  generateUUID,
  makeUUID,
  UUID,
} from "@/core2/domain/common/value-objects/uuid.vo";

export type Post = {
  readonly id: UUID;
  readonly userId: UUID;
  readonly title: string;
  readonly description: string;
};

export const createPost = (input: {
  userId: UUID;
  title: string;
  description: string;
}): Result<Post, InvalidUuidError> => {
  return Result.combine([generateUUID(), makeUUID(input.userId)]).andThen(
    ([id, userId]) => {
      return ok({
        id,
        userId,
        title: input.title,
        description: input.description,
      });
    },
  );
};
