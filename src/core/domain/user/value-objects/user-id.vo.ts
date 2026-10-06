import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { defineValueObject } from "../../common/value-object.base";

/** Identifiant géré par better-auth : chaîne simple, sans préfixe. */
export const userIdSchema = z.string();

export class UserId extends defineValueObject(userIdSchema) {
  public static generate(): UserId {
    return this.make(uuidv4());
  }
}
