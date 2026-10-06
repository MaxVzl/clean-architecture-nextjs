import { defineValueObject } from "../../common/value-object.base";
import {
  entityIdSchema,
  generateEntityId,
} from "../../common/value-objects/entity-id";

export const USER_ID_PREFIX = "user";

export const userIdSchema = entityIdSchema(USER_ID_PREFIX);

export class UserId extends defineValueObject(userIdSchema) {
  public static generate(): UserId {
    return this.make(generateEntityId(USER_ID_PREFIX));
  }
}
