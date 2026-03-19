import { BillingCycle } from "@/core/domain/subscriptions/enums/billing-cycle.enum";
import { BillingModel } from "@/core/domain/subscriptions/enums/billing-model.enum";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import z from "zod";

export const subscriptionSchema = z.object({
  id: uuidSchema,
  companyId: uuidSchema,
  softwareId: uuidSchema,
  billingModel: z.enum(BillingModel),
  unitPrice: z.number(),
  billingCycle: z.enum(BillingCycle),
  totalSeats: z.number(),
});

export type SubscriptionDto = z.infer<typeof subscriptionSchema>;
