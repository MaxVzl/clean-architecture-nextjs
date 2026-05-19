export interface PostNotifierService {
  notifyPostCreated(input: {
    to: string;
    title: string;
    description: string;
  }): Promise<void>;
}
