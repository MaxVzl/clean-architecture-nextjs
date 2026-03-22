import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";

export type PostProps = {
  userId: UUID;
  title: string;
  description: string;
};

export class Post extends Entity<PostProps, UUID> {
  static create(props: PostProps): Post {
    return new Post(props, UUID.generate());
  }

  get userId(): UUID {
    return this._props.userId;
  }

  get title(): string {
    return this._props.title;
  }

  get description(): string {
    return this._props.description;
  }
}
