export interface DomainErrorProps {
  code: string;
  message: string;
}

export abstract class DomainError extends Error {
  public readonly code: string;

  constructor({ code, message }: DomainErrorProps) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
