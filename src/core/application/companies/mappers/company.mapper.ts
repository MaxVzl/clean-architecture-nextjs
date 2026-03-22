import { CompanyDto } from "@/core/application/companies/dtos/company.dto";
import { Company } from "@/core/domain/companies/entities/company.entity";

export class CompanyMapper {
  static toDto(company: Company): CompanyDto {
    return {
      id: company.id.value,
      name: company.name,
      createdAt: company.createdAt,
    };
  }
}
