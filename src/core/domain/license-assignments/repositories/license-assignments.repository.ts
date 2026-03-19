import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { LicenseAssignment } from "../entities/license-assignment.entity";

export interface LicenseAssignmentsRepository {
  findByEmployeeId(employeeId: UUID): Promise<LicenseAssignment[]>;
  findBySubscriptionId(subscriptionId: UUID): Promise<LicenseAssignment[]>;
  findById(id: UUID): Promise<LicenseAssignment | null>;
  save(licenseAssignment: LicenseAssignment): Promise<LicenseAssignment>;
}
