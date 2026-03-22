import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Company } from "../entities/company.entity";

export interface CompaniesRepository {
  findAll(): Promise<Company[]>;
  findById(id: UUID): Promise<Company | null>;
  save(company: Company): Promise<void>;
}
