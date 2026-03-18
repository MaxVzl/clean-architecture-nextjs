import { DomainError } from "./domain.error";

interface ValidationErrorProps {
  message: string;
  field: string;
}

export class ValidationError extends DomainError {
  public readonly field: string;

  constructor({ message, field }: ValidationErrorProps) {
    super({ message });
    this.field = field;
  }
}
