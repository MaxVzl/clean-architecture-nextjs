import { z } from "zod";

import { ValueObject } from "../../common/value-object.base";

export const emailSchema = z.email().min(5);

export type EmailType = z.infer<typeof emailSchema>;

export interface EmailProps extends Record<string, unknown> {
  value: EmailType;
}

export class Email extends ValueObject<EmailProps> {
  public static create(value: EmailType): Email {
    const data = this.validate(emailSchema, value, "Email");
    return new Email({ value: data });
  }

  public get value(): EmailType {
    return this.props.value;
  }
}
