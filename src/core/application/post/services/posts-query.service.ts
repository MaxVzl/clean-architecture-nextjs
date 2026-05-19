import { PostDto } from "@/core/application/post/dtos/post.dto";
import { ListPostQuery } from "@/core/application/post/queries/list-post.query";

export interface PostsQueryService {
  find(query: ListPostQuery): Promise<PostDto[]>;
}
