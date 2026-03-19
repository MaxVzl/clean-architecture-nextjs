import { LicenseAssignmentDto } from "@/core/application/license-assignments/dtos/license-assignment.dto";
import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";
import { Status } from "@/core/domain/license-assignments/enums/status.enum";

export type LicenseAssignmentProps = {
  employeeId: UUID;
  subscriptionId: UUID;
  status: Status;
};

export class LicenseAssignment extends Entity<
  LicenseAssignmentProps,
  UUID,
  LicenseAssignmentDto
> {
  static async create(
    props: LicenseAssignmentProps,
  ): Promise<LicenseAssignment> {
    return new LicenseAssignment(props, UUID.generate());
  }

  toDto(): LicenseAssignmentDto {
    return {
      id: this.id.value,
      employeeId: this._props.employeeId.value,
      subscriptionId: this._props.subscriptionId.value,
      status: this._props.status,
    };
  }
}
