import { defineValueObject } from "../../common/value-object.base";
import {
  entityIdSchema,
  generateEntityId,
} from "../../common/value-objects/entity-id";

export const POST_ID_PREFIX = "post";

export const postIdSchema = entityIdSchema(POST_ID_PREFIX);

export class PostId extends defineValueObject(postIdSchema) {
  public static generate(): PostId {
    return this.make(generateEntityId(POST_ID_PREFIX));
  }
}
