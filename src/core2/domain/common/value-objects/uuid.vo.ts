import { err, ok, Result } from "neverthrow";
import z from "zod";

import { InvalidUuidError } from "@/core2/domain/common/errors/uuid.error";

export const uuidSchema = z.uuidv4();

export type UUID = string & { readonly __brand: "UUID" };

export const makeUUID = (value: string): Result<UUID, InvalidUuidError> => {
  const result = uuidSchema.safeParse(value);
  if (!result.success) {
    return err({
      type: "InvalidUuid",
      value,
    });
  }
  return ok(result.data as UUID);
};

export const generateUUID = (): Result<UUID, InvalidUuidError> =>
  makeUUID(crypto.randomUUID());
