import { LicenseAssignmentDto } from "@/core/application/license-assignments/dtos/license-assignment.dto";
import { LicenseAssignment } from "@/core/domain/license-assignments/entities/license-assignment.entity";

export class LicenseAssignmentMapper {
  static toDto(assignment: LicenseAssignment): LicenseAssignmentDto {
    return {
      id: assignment.id.value,
      employeeId: assignment.employeeId.value,
      subscriptionId: assignment.subscriptionId.value,
      status: assignment.status,
    };
  }
}
