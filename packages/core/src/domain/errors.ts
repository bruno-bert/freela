export class DomainError extends Error {
  constructor(message: string, public readonly status = 400) { super(message); }
}
export class ConflictError extends DomainError { constructor() { super('The record changed. Reload and try again.', 409); } }
