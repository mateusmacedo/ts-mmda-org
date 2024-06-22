export class ValidationError extends Error {
  constructor(
    public path: string,
    public message: string,
    public context?: unknown,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
