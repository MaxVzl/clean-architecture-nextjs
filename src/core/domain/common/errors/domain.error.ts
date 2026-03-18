export interface DomainErrorProps {
  message: string;
}

export abstract class DomainError extends Error {
  constructor({ message }: DomainErrorProps) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
