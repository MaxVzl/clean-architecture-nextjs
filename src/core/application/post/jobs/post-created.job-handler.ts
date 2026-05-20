import { JobHandler } from "@/core/application/common/job-handler.base";
import { JobPayload } from "@/core/application/common/jobs/job-registry";
import type { PostNotifierService } from "@/core/application/post/services/post-notifier.service";

export interface PostCreatedJobHandlerDeps {
  postNotifierService: PostNotifierService;
}

export class PostCreatedJobHandler extends JobHandler<
  "post.created",
  PostCreatedJobHandlerDeps
> {
  async handle(payload: JobPayload<"post.created">): Promise<void> {
    await this.deps.postNotifierService.notifyPostCreated({
      to: payload.email,
      title: payload.title,
      description: payload.description,
    });
  }
}
