import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";

export type PostProps = {
  userId: UUID;
  title: string;
  description: string;
};

export class Post extends Entity<PostProps, UUID> {
  static create(props: PostProps): Post {
    return this.make(props, UUID.generate());
  }
}
