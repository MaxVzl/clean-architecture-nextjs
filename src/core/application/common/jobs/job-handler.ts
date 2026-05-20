import type { JobName, JobPayload } from "./job-registry";

export interface JobHandler<T extends JobName> {
  handle(payload: JobPayload<T>): Promise<void>;
}

export type JobHandlers = {
  [K in JobName]: JobHandler<K>;
};
