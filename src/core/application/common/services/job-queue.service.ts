import type {
  JobName,
  JobPayload,
} from "@/core/application/common/jobs/job-registry";

export interface JobQueueService {
  enqueue<T extends JobName>(job: {
    name: T;
    payload: JobPayload<T>;
    delay?: number;
  }): Promise<void>;
}
