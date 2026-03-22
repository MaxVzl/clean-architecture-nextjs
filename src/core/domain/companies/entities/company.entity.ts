import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";

export type CompanyProps = {
  name: string;
  createdAt: Date;
};

export class Company extends Entity<CompanyProps, UUID> {
  static create(props: CompanyProps): Company {
    return new Company(props, UUID.generate());
  }

  get name(): string {
    return this._props.name;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }
}
