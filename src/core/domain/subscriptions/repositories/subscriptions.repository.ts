import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Subscription } from "../entities/subscription.entity";

export interface SubscriptionsRepository {
  findByCompanyId(companyId: UUID): Promise<Subscription[]>;
  findById(id: UUID): Promise<Subscription | null>;
  save(subscription: Subscription): Promise<Subscription>;
}
