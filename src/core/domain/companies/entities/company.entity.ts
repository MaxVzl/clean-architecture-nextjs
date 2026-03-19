import { CompanyDto } from "@/core/application/companies/dtos/company.dto";
import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";

export type CompanyProps = {
  name: string;
  createdAt: Date;
};

export class Company extends Entity<CompanyProps, UUID, CompanyDto> {
  static async create(props: CompanyProps): Promise<Company> {
    return new Company(props, UUID.generate());
  }

  toDto(): CompanyDto {
    return {
      id: this.id.value,
      name: this._props.name,
      createdAt: this._props.createdAt,
    };
  }
}
