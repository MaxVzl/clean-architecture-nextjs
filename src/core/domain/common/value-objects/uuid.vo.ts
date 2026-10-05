import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { defineValueObject } from "../value-object.base";

export const uuidSchema = z.uuidv4();

export class UUID extends defineValueObject(uuidSchema) {
  public static generate(): UUID {
    return this.make(uuidv4());
  }
}
