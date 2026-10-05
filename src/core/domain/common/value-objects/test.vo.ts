import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { defineValueObject } from "../value-object.base";

export const uuidSchema = z.uuidv4();

export class UUID extends defineValueObject(uuidSchema) {
  public static generate(): UUID {
    return this.make(uuidv4());
  }
}

export const userIdSchema = z
  .string()
  .regex(
    /^user-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  );

export class UserId extends defineValueObject(userIdSchema) {
  public static generate(): UserId {
    return this.make(`user-${uuidv4()}`);
  }
}

export const organizationIdSchema = z
  .string()
  .regex(
    /^org-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  );

export class OrganizationId extends defineValueObject(organizationIdSchema) {
  public static generate(): OrganizationId {
    return this.make(`org-${uuidv4()}`);
  }
}

export const memberIdSchema = z.object({
  userId: userIdSchema,
  organizationId: organizationIdSchema,
});

export class MemberId extends defineValueObject(memberIdSchema) {
  public static generate(): MemberId {
    return this.make({
      userId: UserId.generate().value,
      organizationId: OrganizationId.generate().value,
    });
  }
}

console.log(MemberId.generate().value);
