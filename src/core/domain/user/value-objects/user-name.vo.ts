import { z } from "zod";

import { defineValueObject } from "../../common/value-object.base";

export const userNameSchema = z.string().trim().min(1).max(100);

export class UserName extends defineValueObject(userNameSchema) {}
