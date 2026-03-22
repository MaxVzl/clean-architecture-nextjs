import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";
import { Email } from "../value-objects/email.vo";

export type EmployeeProps = {
  companyId: UUID;
  firstName: string;
  lastName: string;
  email: Email;
  isActive: boolean;
};

export class Employee extends Entity<EmployeeProps, UUID> {
  static create(props: EmployeeProps): Employee {
    return new Employee(props, UUID.generate());
  }

  get companyId(): UUID {
    return this._props.companyId;
  }

  get firstName(): string {
    return this._props.firstName;
  }

  get lastName(): string {
    return this._props.lastName;
  }

  get email(): Email {
    return this._props.email;
  }

  get isActive(): boolean {
    return this._props.isActive;
  }
}
