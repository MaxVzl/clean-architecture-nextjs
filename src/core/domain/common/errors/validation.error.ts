import { DomainError } from "./domain.error";

interface ValidationErrorProps {
  message: string;
  field: string;
  code?: string;
}

export class ValidationError extends DomainError {
  public readonly field: string;

  constructor({
    message,
    field,
    code = "VALIDATION_FAILED",
  }: ValidationErrorProps) {
    super({ code, message });
    this.field = field;
  }
}
