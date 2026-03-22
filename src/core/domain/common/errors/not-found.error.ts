import { DomainError } from "./domain.error";

interface NotFoundErrorProps {
  resource: string;
  identifier: string;
}

export class NotFoundError extends DomainError {
  public readonly resource: string;
  public readonly identifier: string;

  constructor({ resource, identifier }: NotFoundErrorProps) {
    super({
      message: `${resource} with identifier '${identifier}' not found`,
    });
    this.resource = resource;
    this.identifier = identifier;
  }
}
