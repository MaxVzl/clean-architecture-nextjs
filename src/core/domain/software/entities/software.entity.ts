import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";

export type SoftwareProps = {
  companyId: UUID;
  name: string;
  websiteUrl: string;
  category: string;
};

export class Software extends Entity<SoftwareProps, UUID> {
  static create(props: SoftwareProps): Software {
    return new Software(props, UUID.generate());
  }

  get companyId(): UUID {
    return this._props.companyId;
  }

  get name(): string {
    return this._props.name;
  }

  get websiteUrl(): string {
    return this._props.websiteUrl;
  }

  get category(): string {
    return this._props.category;
  }
}
