import { EMessageStatus, TMessageProps } from '../Domain/Messages';
import { BasicMessageBus } from './MessageBus';
import { Command, Event, IQueryHandler, Query, TCommandHandler, TEventHandler } from './Messages';

// Mock classes for testing
class TestCommand extends Command<unknown> {
  constructor(payload: unknown) {
    const props: TMessageProps<unknown, unknown> = {
      id: '1',
      type: 'TestCommand',
      status: EMessageStatus.COMMITTED,
      payload: payload,
      metadata: {},
      timestamp: Date.now(),
    };
    super(props);
  }
}

class TestQuery extends Query<unknown> {
  constructor(payload: unknown) {
    const props: TMessageProps<unknown, unknown> = {
      id: '2',
      type: 'TestQuery',
      status: EMessageStatus.COMMITTED,
      payload: payload,
      metadata: {},
      timestamp: Date.now(),
    };
    super(props);
  }
}

class TestEvent extends Event<unknown> {
  constructor(payload: unknown) {
    const props: TMessageProps<unknown, unknown> = {
      id: '3',
      type: 'TestEvent',
      status: EMessageStatus.COMMITTED,
      payload: payload,
      metadata: {},
      timestamp: Date.now(),
    };
    super(props);
  }
}

class TestCommandHandler implements TCommandHandler<TestCommand> {
  async handle(command: TestCommand): Promise<void> {
    console.log(`Handled command with payload: ${JSON.stringify(command.payload)}`);
  }
}

class TestQueryHandler implements IQueryHandler<TestQuery, unknown> {
  async handle(query: TestQuery): Promise<unknown> {
    return `Handled query with payload: ${JSON.stringify(query.payload)}`;
  }
}

class DifferentTestQueryHandler implements IQueryHandler<TestQuery, unknown> {
  async handle(query: TestQuery): Promise<unknown> {
    return `Different handler response with payload: ${JSON.stringify(query.payload)}`;
  }
}

class TestEventHandler implements TEventHandler<TestEvent> {
  async handle(event: TestEvent): Promise<void> {
    console.log(`Handled event with payload: ${JSON.stringify(event.payload)}`);
  }
}

describe('BasicMessageBus', () => {
  let messageBus: BasicMessageBus;

  beforeEach(() => {
    messageBus = new BasicMessageBus();
  });

  // Happy Path Tests
  it('should register and handle a command', async () => {
    const handler = new TestCommandHandler();
    messageBus.registerCommandHandler('TestCommand', handler);
    const command = new TestCommand({ some: 'commandPayload' });
    await expect(messageBus.sendCommand(command)).resolves.not.toThrow();
  });

  it('should register and handle a query', async () => {
    const handler = new TestQueryHandler();
    messageBus.registerQueryHandler('TestQuery', handler);
    const query = new TestQuery({ some: 'queryPayload' });
    await expect(messageBus.sendQuery(query)).resolves.toBe(
      'Handled query with payload: {"some":"queryPayload"}',
    );
  });

  it('should register and handle an event', async () => {
    const handler = new TestEventHandler();
    messageBus.registerEventHandler('TestEvent', handler);
    const event = new TestEvent({ some: 'eventPayload' });
    await expect(messageBus.publishEvent(event)).resolves.not.toThrow();
  });

  // Edge Case Tests
  it('should overwrite a command handler with an existing command type', async () => {
    const handler1 = new TestCommandHandler();
    const handler2 = new TestCommandHandler();
    messageBus.registerCommandHandler('TestCommand', handler1);
    messageBus.registerCommandHandler('TestCommand', handler2); // Overwrite
    const command = new TestCommand({ some: 'commandPayload' });
    await expect(messageBus.sendCommand(command)).resolves.not.toThrow();
  });

  it('should overwrite a query handler with an existing query type', async () => {
    const handler1 = new TestQueryHandler();
    const handler2 = new DifferentTestQueryHandler();
    messageBus.registerQueryHandler('TestQuery', handler1);
    messageBus.registerQueryHandler('TestQuery', handler2); // Overwrite
    const query = new TestQuery({ some: 'queryPayload' });
    await expect(messageBus.sendQuery(query)).resolves.toBe(
      'Different handler response with payload: {"some":"queryPayload"}',
    );
  });

  it('should add event handler to existing handlers for the same event type', async () => {
    const handler1 = new TestEventHandler();
    const handler2 = new TestEventHandler();
    jest.spyOn(handler1, 'handle');
    jest.spyOn(handler2, 'handle');
    messageBus.registerEventHandler('TestEvent', handler1);
    messageBus.registerEventHandler('TestEvent', handler2); // Add to existing
    const event = new TestEvent({ some: 'eventPayload' });
    await messageBus.publishEvent(event);
    expect(handler1.handle).toHaveBeenCalled();
    expect(handler2.handle).toHaveBeenCalled();
  });

  it('should throw an error if no handler is registered for a command', async () => {
    const command = new TestCommand({ some: 'commandPayload' });
    await expect(messageBus.sendCommand(command)).rejects.toThrow(
      `No handler registered for command type ${command.type}`,
    );
  });

  it('should throw an error if no handler is registered for a query', async () => {
    const query = new TestQuery({ some: 'queryPayload' });
    await expect(messageBus.sendQuery(query)).rejects.toThrow(
      `No handler registered for query type ${query.type}`,
    );
  });

  it('should not throw an error if no handlers are registered for an event', async () => {
    const event = new TestEvent({ some: 'eventPayload' });
    await expect(messageBus.publishEvent(event)).resolves.not.toThrow();
  });

  // Middleware Tests
  it('should apply middlewares for a command', async () => {
    const handler = new TestCommandHandler();
    messageBus.registerCommandHandler('TestCommand', handler);

    const middleware = jest.fn((message, next) => next());
    messageBus.use(middleware);

    const command = new TestCommand({ some: 'commandPayload' });
    await messageBus.sendCommand(command);

    expect(middleware).toHaveBeenCalledWith(command, expect.any(Function));
  });

  it('should apply middlewares for a query', async () => {
    const handler = new TestQueryHandler();
    messageBus.registerQueryHandler('TestQuery', handler);

    const middleware = jest.fn((message, next) => next());
    messageBus.use(middleware);

    const query = new TestQuery({ some: 'queryPayload' });
    await messageBus.sendQuery(query);

    expect(middleware).toHaveBeenCalledWith(query, expect.any(Function));
  });

  it('should apply middlewares for an event', async () => {
    const handler = new TestEventHandler();
    messageBus.registerEventHandler('TestEvent', handler);

    const middleware = jest.fn((message, next) => next());
    messageBus.use(middleware);

    const event = new TestEvent({ some: 'eventPayload' });
    await messageBus.publishEvent(event);

    expect(middleware).toHaveBeenCalledWith(event, expect.any(Function));
  });

  it('should call next middleware in chain', async () => {
    const handler = new TestCommandHandler();
    messageBus.registerCommandHandler('TestCommand', handler);

    const middleware1 = jest.fn((message, next) => next());
    const middleware2 = jest.fn((message, next) => next());
    const middleware3 = jest.fn((message, next) => next());

    messageBus.use(middleware1);
    messageBus.use(middleware2);
    messageBus.use(middleware3);

    const command = new TestCommand({ some: 'commandPayload' });
    await messageBus.sendCommand(command);

    expect(middleware1).toHaveBeenCalledWith(command, expect.any(Function));
    expect(middleware2).toHaveBeenCalledWith(command, expect.any(Function));
    expect(middleware3).toHaveBeenCalledWith(command, expect.any(Function));
  });
});
