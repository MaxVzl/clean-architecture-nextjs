export type JobRegistry = {
  "post.created": {
    email: string;
    title: string;
    description: string;
  };
};

export type JobName = keyof JobRegistry;
export type JobPayload<T extends JobName> = JobRegistry[T];
