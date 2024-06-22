import { IHandler, IMessage } from '../Domain/Messages';
import { CircuitBreakerHandlerError } from './HandlerErrors';

export type TCircuitBreakerPolicy = {
  failureThreshold: number;
  cooldownPeriod: number;
  resetTimeout: number;
};

export enum ECircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export class CircuitBreakerHandler<T extends IMessage> implements IHandler<T> {
  private state: ECircuitBreakerState = ECircuitBreakerState.CLOSED;
  private failureCount = 0;
  private nextAttempt = Date.now();

  constructor(
    private handler: IHandler<T>,
    private policy: TCircuitBreakerPolicy,
  ) {
    this.validatePolicy(policy);
  }

  async handle(message: T): Promise<void> {
    if (this.state === ECircuitBreakerState.OPEN && Date.now() < this.nextAttempt) {
      throw new CircuitBreakerHandlerError('Circuit breaker is open');
    }

    if (this.state === ECircuitBreakerState.OPEN) {
      this.state = ECircuitBreakerState.HALF_OPEN;
    }

    try {
      await this.handler.handle(message);
      this.reset();
    } catch (error) {
      this.recordFailure();
      if (
        this.state === ECircuitBreakerState.HALF_OPEN ||
        this.failureCount >= this.policy.failureThreshold
      ) {
        this.open();
      }
      throw error;
    }
  }

  private reset() {
    this.state = ECircuitBreakerState.CLOSED;
    this.failureCount = 0;
  }

  private open() {
    this.state = ECircuitBreakerState.OPEN;
    this.nextAttempt = Date.now() + this.policy.cooldownPeriod;
  }

  private recordFailure() {
    this.failureCount++;
  }

  private validatePolicy(policy: TCircuitBreakerPolicy) {
    if (policy.failureThreshold <= 0) {
      throw new CircuitBreakerHandlerError('failureThreshold must be greater than 0');
    }
    if (policy.cooldownPeriod <= 0) {
      throw new CircuitBreakerHandlerError('cooldownPeriod must be greater than 0');
    }
    if (policy.resetTimeout <= 0) {
      throw new CircuitBreakerHandlerError('resetTimeout must be greater than 0');
    }
  }
}
