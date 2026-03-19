import { EmployeeDto } from "@/core/application/employees/dtos/employee.dto";
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

export class Employee extends Entity<EmployeeProps, UUID, EmployeeDto> {
  static async create(props: EmployeeProps): Promise<Employee> {
    return new Employee(props, UUID.generate());
  }

  toDto(): EmployeeDto {
    return {
      id: this.id.value,
      companyId: this._props.companyId.value,
      firstName: this._props.firstName,
      lastName: this._props.lastName,
      email: this._props.email.value,
      isActive: this._props.isActive,
    };
  }
}
