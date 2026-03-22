import { SubscriptionDto } from "@/core/application/subscriptions/dtos/subscription.dto";
import { Subscription } from "@/core/domain/subscriptions/entities/subscription.entity";

export class SubscriptionMapper {
  static toDto(subscription: Subscription): SubscriptionDto {
    return {
      id: subscription.id.value,
      companyId: subscription.companyId.value,
      softwareId: subscription.softwareId.value,
      billingModel: subscription.billingModel,
      unitPrice: subscription.unitPrice,
      billingCycle: subscription.billingCycle,
      totalSeats: subscription.totalSeats,
    };
  }
}
