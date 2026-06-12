import { PostDto } from "@/core/application/post/dtos/post.dto";
import { ListPostQuery } from "@/core/application/post/queries/list-post.query";
import { PaginatedDto } from "@/core/application/common/dtos/paginated.dto";

export interface PostsQueryService {
  find(query: ListPostQuery): Promise<PaginatedDto<PostDto>>;
  findById(id: string): Promise<PostDto | null>;
}
