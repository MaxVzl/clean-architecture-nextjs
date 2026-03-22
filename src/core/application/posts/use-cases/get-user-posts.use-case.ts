import { UseCase } from "@/core/application/common/use-case.base";
import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { PostMapper } from "@/core/application/posts/mappers/post.mapper";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";

export interface GetUserPostsUseCaseDeps {
  postsRepository: PostsRepository;
}

export interface GetUserPostsUseCaseParams {
  userId: string;
}

export class GetUserPostsUseCase extends UseCase<
  GetUserPostsUseCaseDeps,
  PostDto[],
  GetUserPostsUseCaseParams
> {
  async execute({ userId }: GetUserPostsUseCaseParams): Promise<PostDto[]> {
    const posts = await this.deps.postsRepository.findByUserId(
      UUID.create(userId),
    );
    return posts.map(PostMapper.toDto);
  }
}
