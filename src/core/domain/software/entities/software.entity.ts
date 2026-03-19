import { SoftwareDto } from "@/core/application/software/dtos/software.dto";
import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";

export type SoftwareProps = {
  companyId: UUID;
  name: string;
  websiteUrl: string;
  category: string;
};

export class Software extends Entity<SoftwareProps, UUID, SoftwareDto> {
  static async create(props: SoftwareProps): Promise<Software> {
    return new Software(props, UUID.generate());
  }

  toDto(): SoftwareDto {
    return {
      id: this.id.value,
      companyId: this._props.companyId.value,
      name: this._props.name,
      websiteUrl: this._props.websiteUrl,
      category: this._props.category,
    };
  }
}
