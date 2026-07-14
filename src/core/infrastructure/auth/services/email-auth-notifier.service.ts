import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";
import type { EmailService } from "@/core/application/common/services/email.service";

export interface EmailAuthNotifierServiceDeps {
  emailService: EmailService;
}

export class EmailAuthNotifierService implements AuthNotifierService {
  constructor(protected readonly deps: EmailAuthNotifierServiceDeps) {}

  async notifyPasswordReset(input: { to: string; url: string }): Promise<void> {
    await this.deps.emailService.send({
      to: input.to,
      subject: `Password reset`,
      body: `Click <a href="${input.url}">here</a> to reset your password`,
    });
  }
}
