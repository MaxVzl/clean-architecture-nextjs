import { BillingCycle } from "../enums/billing-cycle.enum";
import { BillingModel } from "../enums/billing-model.enum";
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

export class Subscription extends Entity<SubscriptionProps, UUID> {
  static create(props: SubscriptionProps): Subscription {
    return new Subscription(props, UUID.generate());
  }

  get companyId(): UUID {
    return this._props.companyId;
  }

  get softwareId(): UUID {
    return this._props.softwareId;
  }

  get billingModel(): BillingModel {
    return this._props.billingModel;
  }

  get unitPrice(): number {
    return this._props.unitPrice;
  }

  get billingCycle(): BillingCycle {
    return this._props.billingCycle;
  }

  get totalSeats(): number {
    return this._props.totalSeats;
  }
}
