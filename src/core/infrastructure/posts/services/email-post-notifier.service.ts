import type { EmailService } from "@/core/application/common/services/email.service";
import type { PostNotifierService } from "@/core/application/posts/services/post-notifier.service";
import { Service } from "@/core/infrastructure/common/service.base";
import { render } from "react-email";
import PostCreatedEmail from "@/core/infrastructure/emails/post-created.email";

export interface EmailPostNotifierServiceDeps {
  emailService: EmailService;
}

export class EmailPostNotifierService
  extends Service<EmailPostNotifierServiceDeps>
  implements PostNotifierService
{
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
