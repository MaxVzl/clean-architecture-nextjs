import { EmployeeDto } from "@/core/application/employees/dtos/employee.dto";
import { Employee } from "@/core/domain/employees/entities/employee.entity";

export class EmployeeMapper {
  static toDto(employee: Employee): EmployeeDto {
    return {
      id: employee.id.value,
      companyId: employee.companyId.value,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email.value,
      isActive: employee.isActive,
    };
  }
}
