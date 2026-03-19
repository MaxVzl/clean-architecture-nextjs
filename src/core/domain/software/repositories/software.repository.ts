import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Software } from "../entities/software.entity";

export interface SoftwareRepository {
  findByCompanyId(companyId: UUID): Promise<Software[]>;
  findById(id: UUID): Promise<Software | null>;
  save(software: Software): Promise<Software>;
}
