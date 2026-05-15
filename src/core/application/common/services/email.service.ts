export interface EmailService {
  send({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void>;
  sendCreatePost({
    to,
    title,
    description,
  }: {
    to: string;
    title: string;
    description: string;
  }): Promise<void>;
}
