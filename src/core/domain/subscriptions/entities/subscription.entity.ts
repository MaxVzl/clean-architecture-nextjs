import { SubscriptionDto } from "@/core/application/subscriptions/dtos/subscription.dto";
import { BillingCycle } from "@/core/domain/subscriptions/enums/billing-cycle.enum";
import { BillingModel } from "@/core/domain/subscriptions/enums/billing-model.enum";
import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";

export type SubscriptionProps = {
  companyId: UUID;
  softwareId: UUID;
  billingModel: BillingModel;
  unitPrice: number;
  billingCycle: BillingCycle;
  totalSeats: number;
};

export class Subscription extends Entity<
  SubscriptionProps,
  UUID,
  SubscriptionDto
> {
  static async create(props: SubscriptionProps): Promise<Subscription> {
    return new Subscription(props, UUID.generate());
  }

  toDto(): SubscriptionDto {
    return {
      id: this.id.value,
      companyId: this._props.companyId.value,
      softwareId: this._props.softwareId.value,
      billingModel: this._props.billingModel,
      unitPrice: this._props.unitPrice,
      billingCycle: this._props.billingCycle,
      totalSeats: this._props.totalSeats,
    };
  }
}
