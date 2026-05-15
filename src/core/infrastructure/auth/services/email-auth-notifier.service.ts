import type { EmailService } from "@/core/application/common/services/email.service";
import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";
import { Service } from "@/core/infrastructure/common/service.base";

export interface EmailAuthNotifierServiceDeps {
  emailService: EmailService;
}

export class EmailAuthNotifierService
  extends Service<EmailAuthNotifierServiceDeps>
  implements AuthNotifierService
{
  async notifyPasswordReset(input: { to: string; url: string }): Promise<void> {
    await this.deps.emailService.send({
      to: input.to,
      subject: `Password reset`,
      body: `Click <a href="${input.url}">here</a> to reset your password`,
    });
  }
}
