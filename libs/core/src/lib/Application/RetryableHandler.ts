import { IHandler, IMessage } from '../Domain/Messages';
import { RetryableHandlerError } from './HandlerErrors';

export type TRetryPolicy = {
  retries: number;
  interval: number;
};

export class RetryableHandler<T extends IMessage> implements IHandler<T> {
  constructor(
    private readonly handler: IHandler<T>,
    private readonly policy: TRetryPolicy,
  ) {
    this.validatePolicy(policy);
  }

  async handle(message: T): Promise<void> {
    let attempts = 0;

    const tryHandling = async (): Promise<void> => {
      try {
        await this.handler.handle(message);
      } catch (error) {
        if (attempts < this.policy.retries) {
          attempts++;
          await this.delay(this.policy.interval);
          await tryHandling();
        } else {
          throw error;
        }
      }
    };

    await tryHandling();
  }

  private validatePolicy(policy: TRetryPolicy): void {
    if (policy.retries < 0) {
      throw new RetryableHandlerError('Retries must be a non-negative number');
    }
    if (policy.interval <= 0) {
      throw new RetryableHandlerError('Interval must be a positive number');
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
