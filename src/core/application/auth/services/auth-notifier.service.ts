export interface AuthNotifierService {
  notifyPasswordReset(input: { to: string; url: string }): Promise<void>;
}
