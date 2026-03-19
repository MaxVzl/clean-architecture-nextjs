import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Employee } from "../entities/employee.entity";

export interface EmployeesRepository {
  findByCompanyId(companyId: UUID): Promise<Employee[]>;
  findById(id: UUID): Promise<Employee | null>;
  save(employee: Employee): Promise<Employee>;
}
