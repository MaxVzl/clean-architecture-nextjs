import { err, ok, Result } from "neverthrow";
import z from "zod";

import { InvalidEmailError } from "@/core2/domain/user/errors/email.error";

export const emailSchema = z.email().min(5);

export type Email = string & { readonly __brand: "Email" };

export const makeEmail = (email: string): Result<Email, InvalidEmailError> => {
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return err({
      type: "InvalidEmail",
      value: email,
    });
  }
  return ok(result.data as Email);
};
