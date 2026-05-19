import type { EmailService } from "@/core/application/common/services/email.service";
import type { PostNotifierService } from "@/core/application/post/services/post-notifier.service";
import { render } from "react-email";
import PostCreatedEmail from "@/core/infrastructure/emails/post-created.email";

export interface EmailPostNotifierServiceDeps {
  emailService: EmailService;
}

export class EmailPostNotifierService implements PostNotifierService {
  constructor(protected readonly deps: EmailPostNotifierServiceDeps) {}

  async notifyPostCreated(input: {
    to: string;
    title: string;
    description: string;
  }): Promise<void> {
    const body = await render(
      PostCreatedEmail({ title: input.title, description: input.description }),
      { pretty: true },
    );

    await this.deps.emailService.send({
      to: input.to,
      subject: `New post created: ${input.title}`,
      body,
    });
  }
}
