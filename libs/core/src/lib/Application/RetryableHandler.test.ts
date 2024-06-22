import {
  EMessageStatus,
  IHandler,
  IMessage,
  TMessageMetadata,
  TMessagePayload,
} from '../Domain/Messages';
import { RetryableHandler, TRetryPolicy } from './RetryableHandler';

class MockMessage implements IMessage {
  get id(): string {
    throw new Error('Method not implemented.');
  }
  get type(): string {
    throw new Error('Method not implemented.');
  }
  get status(): EMessageStatus {
    throw new Error('Method not implemented.');
  }
  get payload(): TMessagePayload<unknown> {
    throw new Error('Method not implemented.');
  }
  get metadata(): TMessageMetadata<unknown> {
    throw new Error('Method not implemented.');
  }
  get timestamp(): number {
    throw new Error('Method not implemented.');
  }
  // Mock implementation of IMessage
}

class MockHandler implements IHandler<MockMessage> {
  private handleFn: jest.Mock;

  constructor(handleFn: jest.Mock) {
    this.handleFn = handleFn;
  }

  async handle(message: MockMessage): Promise<void> {
    return this.handleFn(message);
  }
}

describe('RetryableHandler', () => {
  let message: MockMessage;
  let handleFn: jest.Mock;
  let handler: MockHandler;
  let retryPolicy: TRetryPolicy;

  beforeEach(() => {
    message = new MockMessage();
    handleFn = jest.fn();
    handler = new MockHandler(handleFn);
    retryPolicy = { retries: 3, interval: 10 };
  });

  it('should successfully handle the message', async () => {
    const retryableHandler = new RetryableHandler(handler, retryPolicy);
    handleFn.mockResolvedValueOnce(undefined);

    await retryableHandler.handle(message);

    expect(handleFn).toHaveBeenCalledTimes(1);
  });

  it('should successfully handle the message after one retry', async () => {
    const retryableHandler = new RetryableHandler(handler, retryPolicy);
    handleFn.mockRejectedValueOnce(new Error('Temporary Error')).mockResolvedValueOnce(undefined);

    await retryableHandler.handle(message);

    expect(handleFn).toHaveBeenCalledTimes(2);
  });

  it('should successfully handle the message after multiple retries', async () => {
    const retryableHandler = new RetryableHandler(handler, retryPolicy);
    handleFn
      .mockRejectedValueOnce(new Error('Temporary Error'))
      .mockRejectedValueOnce(new Error('Temporary Error'))
      .mockResolvedValueOnce(undefined);

    await retryableHandler.handle(message);

    expect(handleFn).toHaveBeenCalledTimes(3);
  });

  it('should throw an error after reaching the maximum number of retries', async () => {
    const retryableHandler = new RetryableHandler(handler, retryPolicy);
    handleFn.mockRejectedValue(new Error('Persistent Error'));

    await expect(retryableHandler.handle(message)).rejects.toThrow('Persistent Error');

    expect(handleFn).toHaveBeenCalledTimes(4);
  });

  it('should throw an error for negative retries', () => {
    retryPolicy = { retries: -1, interval: 10 };

    expect(() => new RetryableHandler(handler, retryPolicy)).toThrow(
      'Retries must be a non-negative number',
    );
  });

  it('should throw an error for non-positive interval', () => {
    retryPolicy = { retries: 3, interval: 0 };

    expect(() => new RetryableHandler(handler, retryPolicy)).toThrow(
      'Interval must be a positive number',
    );
  });
});
