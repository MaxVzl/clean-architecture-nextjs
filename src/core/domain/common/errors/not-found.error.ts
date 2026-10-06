import { DomainError } from "./domain.error";

interface NotFoundErrorProps {
  code: string;
  resource: string;
  identifier: string;
}

export abstract class NotFoundError extends DomainError {
  public readonly resource: string;
  public readonly identifier: string;

  constructor({ code, resource, identifier }: NotFoundErrorProps) {
    super({
      code,
      message: `${resource} with identifier '${identifier}' not found`,
    });
    this.resource = resource;
    this.identifier = identifier;
  }
}
