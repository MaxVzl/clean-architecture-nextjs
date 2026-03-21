import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";

export type PostProps = {
  userId: UUID;
  title: string;
  description: string;
};

export class Post extends Entity<PostProps, UUID, PostDto> {
  static create(props: PostProps): Post {
    return new Post(props, UUID.generate());
  }

  get userId(): UUID {
    return this._props.userId;
  }

  toDto(): PostDto {
    return {
      id: this.id.value,
      title: this._props.title,
      description: this._props.description,
    };
  }
}
