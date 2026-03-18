import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { ValueObject } from "../value-object.base";

export const uuidSchema = z.uuidv4();

export type UUIDType = z.infer<typeof uuidSchema>;

export interface UUIDProps extends Record<string, unknown> {
  value: string;
}

export class UUID extends ValueObject<UUIDProps> {
  public static create(value: UUIDType): UUID {
    const data = this.validate(uuidSchema, value, "UUID");
    return new UUID({ value: data });
  }

  public static generate(): UUID {
    return new UUID({ value: uuidv4() });
  }

  public get value(): string {
    return this.props.value;
  }
}
