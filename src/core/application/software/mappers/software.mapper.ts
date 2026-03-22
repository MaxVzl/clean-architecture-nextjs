import { SoftwareDto } from "@/core/application/software/dtos/software.dto";
import { Software } from "@/core/domain/software/entities/software.entity";

export class SoftwareMapper {
  static toDto(software: Software): SoftwareDto {
    return {
      id: software.id.value,
      companyId: software.companyId.value,
      name: software.name,
      websiteUrl: software.websiteUrl,
      category: software.category,
    };
  }
}
