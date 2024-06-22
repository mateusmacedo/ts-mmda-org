export class CircuitBreakerHandlerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerHandlerError';
  }
}

export class RetryableHandlerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetryableHandlerError';
  }
}
