import {
  EMessageStatus,
  IHandler,
  IMessage,
  TMessageMetadata,
  TMessagePayload,
} from '../Domain/Messages';
import {
  CircuitBreakerHandler,
  ECircuitBreakerState,
  TCircuitBreakerPolicy,
} from './CircuitBreakerHandler';
import { CircuitBreakerHandlerError } from './HandlerErrors';

class MockMessage implements IMessage {
  constructor(public id: string) {}
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
}

class MockHandler implements IHandler<MockMessage> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(message: MockMessage): Promise<void> {
    // Simulate handling message
  }
}

describe('CircuitBreakerHandler', () => {
  let handler: MockHandler;
  let circuitBreakerHandler: CircuitBreakerHandler<MockMessage>;
  let policy: TCircuitBreakerPolicy;

  beforeEach(() => {
    handler = new MockHandler();
    policy = {
      failureThreshold: 2,
      cooldownPeriod: 1000,
      resetTimeout: 5000,
    };
    circuitBreakerHandler = new CircuitBreakerHandler(handler, policy);
  });

  test('initial state is CLOSED', () => {
    expect(circuitBreakerHandler['state']).toBe(ECircuitBreakerState.CLOSED);
  });

  test('handle() calls inner handler when CLOSED and successful', async () => {
    const mockMessage = new MockMessage('1');
    const handleSpy = jest.spyOn(handler, 'handle').mockResolvedValueOnce();

    await circuitBreakerHandler.handle(mockMessage);

    expect(handleSpy).toHaveBeenCalledWith(mockMessage);
    expect(circuitBreakerHandler['state']).toBe(ECircuitBreakerState.CLOSED);
    expect(circuitBreakerHandler['failureCount']).toBe(0);
  });

  test('handle() records failure when inner handler throws error', async () => {
    const mockMessage = new MockMessage('2');
    const handleSpy = jest
      .spyOn(handler, 'handle')
      .mockRejectedValueOnce(new Error('Handler error'));

    await expect(circuitBreakerHandler.handle(mockMessage)).rejects.toThrow('Handler error');

    expect(handleSpy).toHaveBeenCalledWith(mockMessage);
    expect(circuitBreakerHandler['state']).toBe(ECircuitBreakerState.CLOSED);
    expect(circuitBreakerHandler['failureCount']).toBe(1);
  });

  test('handle() transitions to OPEN state after reaching failure threshold', async () => {
    const mockMessage = new MockMessage('3');
    jest.spyOn(handler, 'handle').mockRejectedValue(new Error('Handler error'));

    await expect(circuitBreakerHandler.handle(mockMessage)).rejects.toThrow('Handler error');
    await expect(circuitBreakerHandler.handle(mockMessage)).rejects.toThrow('Handler error');

    expect(circuitBreakerHandler['state']).toBe(ECircuitBreakerState.OPEN);
    expect(circuitBreakerHandler['failureCount']).toBe(2);
  });

  test('handle() throws CircuitBreakerHandlerError when OPEN and within cooldown period', async () => {
    const mockMessage = new MockMessage('4');
    circuitBreakerHandler['state'] = ECircuitBreakerState.OPEN;
    circuitBreakerHandler['nextAttempt'] = Date.now() + 1000;

    await expect(circuitBreakerHandler.handle(mockMessage)).rejects.toThrow(
      CircuitBreakerHandlerError,
    );
  });

  test('handle() transitions to HALF_OPEN state after cooldown period', async () => {
    const mockMessage = new MockMessage('5');
    circuitBreakerHandler['state'] = ECircuitBreakerState.OPEN;
    circuitBreakerHandler['nextAttempt'] = Date.now() - 1000;

    const handleSpy = jest.spyOn(handler, 'handle').mockResolvedValueOnce();

    await circuitBreakerHandler.handle(mockMessage);

    expect(handleSpy).toHaveBeenCalledWith(mockMessage);
    expect(circuitBreakerHandler['state']).toBe(ECircuitBreakerState.CLOSED);
    expect(circuitBreakerHandler['failureCount']).toBe(0);
  });

  test('handle() transitions to OPEN state from HALF_OPEN if handle() throws error', async () => {
    const mockMessage = new MockMessage('6');
    circuitBreakerHandler['state'] = ECircuitBreakerState.HALF_OPEN;
    const handleSpy = jest
      .spyOn(handler, 'handle')
      .mockRejectedValueOnce(new Error('Handler error'));

    await expect(circuitBreakerHandler.handle(mockMessage)).rejects.toThrow('Handler error');

    expect(handleSpy).toHaveBeenCalledWith(mockMessage);
    expect(circuitBreakerHandler['state']).toBe(ECircuitBreakerState.OPEN);
  });

  test('handle() resets to CLOSED state from HALF_OPEN if handle() is successful', async () => {
    const mockMessage = new MockMessage('7');
    circuitBreakerHandler['state'] = ECircuitBreakerState.HALF_OPEN;
    const handleSpy = jest.spyOn(handler, 'handle').mockResolvedValueOnce();

    await circuitBreakerHandler.handle(mockMessage);

    expect(handleSpy).toHaveBeenCalledWith(mockMessage);
    expect(circuitBreakerHandler['state']).toBe(ECircuitBreakerState.CLOSED);
    expect(circuitBreakerHandler['failureCount']).toBe(0);
  });

  // Edge Case
  test('handle() respects cooldown period and transitions to HALF_OPEN', async () => {
    const mockMessage = new MockMessage('8');
    circuitBreakerHandler['state'] = ECircuitBreakerState.OPEN;
    circuitBreakerHandler['nextAttempt'] = Date.now() - 1000;

    const handleSpy = jest.spyOn(handler, 'handle').mockResolvedValueOnce();

    await circuitBreakerHandler.handle(mockMessage);

    expect(handleSpy).toHaveBeenCalledWith(mockMessage);
    expect(circuitBreakerHandler['state']).toBe(ECircuitBreakerState.CLOSED);
    expect(circuitBreakerHandler['failureCount']).toBe(0);
  });

  // Tests for validatePolicy
  test('validatePolicy throws error if failureThreshold is less than or equal to 0', () => {
    expect(
      () => new CircuitBreakerHandler(handler, { ...policy, failureThreshold: 0 }),
    ).toThrowError('failureThreshold must be greater than 0');
  });

  test('validatePolicy throws error if cooldownPeriod is less than or equal to 0', () => {
    expect(() => new CircuitBreakerHandler(handler, { ...policy, cooldownPeriod: 0 })).toThrowError(
      'cooldownPeriod must be greater than 0',
    );
  });

  test('validatePolicy throws error if resetTimeout is less than or equal to 0', () => {
    expect(() => new CircuitBreakerHandler(handler, { ...policy, resetTimeout: 0 })).toThrowError(
      'resetTimeout must be greater than 0',
    );
  });
});
