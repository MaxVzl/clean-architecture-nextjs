import type { PostNotifierService } from "@/core/application/posts/services/post-notifier.service";
import type { EmailService } from "@/core/application/common/services/email.service";
import { render } from "react-email";
import PostCreatedEmail from "@/core/infrastructure/emails/post-created.email";

export class EmailPostNotifierService implements PostNotifierService {
  constructor(private readonly emailService: EmailService) {}

  async notifyPostCreated(input: {
    to: string;
    title: string;
    description: string;
  }): Promise<void> {
    const body = await render(
      PostCreatedEmail({ title: input.title, description: input.description }),
      { pretty: true },
    );

    await this.emailService.send({
      to: input.to,
      subject: `New post created: ${input.title}`,
      body,
    });
  }
}
