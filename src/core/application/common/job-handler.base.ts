import type {
  JobName,
  JobPayload,
} from "@/core/application/common/jobs/job-registry";
import type { JobHandler as JobHandlerType } from "@/core/application/common/jobs/job-handler";

export abstract class JobHandler<
  T extends JobName,
  Dependencies,
> implements JobHandlerType<T> {
  constructor(protected readonly deps: Dependencies) {}

  abstract handle(payload: JobPayload<T>): Promise<void>;
}
