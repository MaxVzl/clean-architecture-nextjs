import { Entity } from "../../common/entity.base";
import { UserId } from "../../user/value-objects/user-id.vo";
import { PostId } from "../value-objects/post-id.vo";

export type PostProps = {
  authorId: UserId;
  title: string;
  description: string;
};

export class Post extends Entity<PostProps, PostId> {
  static create(props: PostProps): Post {
    return this.make(props, PostId.generate());
  }
}
