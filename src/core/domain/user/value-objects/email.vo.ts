import { z } from "zod";

import { defineValueObject } from "../../common/value-object.base";

export const emailSchema = z.email().min(5);

export class Email extends defineValueObject(emailSchema) {}
