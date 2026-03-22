import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";
import { Status } from "../enums/status.enum";

export type LicenseAssignmentProps = {
  employeeId: UUID;
  subscriptionId: UUID;
  status: Status;
};

export class LicenseAssignment extends Entity<LicenseAssignmentProps, UUID> {
  static create(props: LicenseAssignmentProps): LicenseAssignment {
    return new LicenseAssignment(props, UUID.generate());
  }

  get employeeId(): UUID {
    return this._props.employeeId;
  }

  get subscriptionId(): UUID {
    return this._props.subscriptionId;
  }

  get status(): Status {
    return this._props.status;
  }
}
