import { EMessageStatus, TMessageProps } from '../Domain/Messages';
import { BasicMessageBus } from './MessageBus';
import { Command, Event, IQueryHandler, Query, TCommandHandler, TEventHandler } from './Messages';

class TestCommand extends Command<unknown> {
  constructor(payload: unknown) {
    const props: TMessageProps<unknown, unknown> = {
      id: '1',
      type: 'TestCommand',
      status: EMessageStatus.CREATED,
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
      status: EMessageStatus.CREATED,
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
      status: EMessageStatus.CREATED,
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

  // Testes de Caminho Feliz
  it('should register and treat a command', async () => {
    const handler = new TestCommandHandler();
    messageBus.registerCommandHandler('TestCommand', handler);
    const command = new TestCommand({ some: 'commandPayload' });
    await expect(messageBus.sendCommand(command)).resolves.not.toThrow();
  });

  it('should register and treat multiple command handlers', async () => {
    const handler1 = new TestCommandHandler();
    const handler2 = new TestCommandHandler();
    messageBus.registerCommandHandler('TestCommand', handler1);
    messageBus.registerCommandHandler('TestCommand', handler2);
    const command = new TestCommand({ some: 'commandPayload' });
    await expect(messageBus.sendCommand(command)).resolves.not.toThrow();
  });

  it('should register and treat an appointment', async () => {
    const handler = new TestQueryHandler();
    messageBus.registerQueryHandler('TestQuery', handler);
    const query = new TestQuery({ some: 'queryPayload' });
    await expect(messageBus.sendQuery(query)).resolves.toBe(
      'Handled query with payload: {"some":"queryPayload"}',
    );
  });

  it('should register and treat multiple query handlers', async () => {
    const handler1 = new TestQueryHandler();
    const handler2 = new DifferentTestQueryHandler();
    messageBus.registerQueryHandler('TestQuery', handler1);
    expect(() => messageBus.registerQueryHandler('TestQuery', handler2)).toThrow(
      `A handler is already registered for query type TestQuery`,
    );
  });

  it('should register and treat an event', async () => {
    const handler = new TestEventHandler();
    messageBus.registerEventHandler('TestEvent', handler);
    const event = new TestEvent({ some: 'eventPayload' });
    await expect(messageBus.publishEvent(event)).resolves.not.toThrow();
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

  it('should not release an error if no handler is registered for an event', async () => {
    const event = new TestEvent({ some: 'eventPayload' });
    await expect(messageBus.publishEvent(event)).resolves.not.toThrow();
  });

  it('should apply middlewares to a command', async () => {
    const handler = new TestCommandHandler();
    messageBus.registerCommandHandler('TestCommand', handler);

    const middleware = jest.fn((message, next) => next());
    messageBus.use(middleware);

    const command = new TestCommand({ some: 'commandPayload' });
    await messageBus.sendCommand(command);

    expect(middleware).toHaveBeenCalledWith(command, expect.any(Function));
  });

  it('should apply middlewares to a query', async () => {
    const handler = new TestQueryHandler();
    messageBus.registerQueryHandler('TestQuery', handler);

    const middleware = jest.fn((message, next) => next());
    messageBus.use(middleware);

    const query = new TestQuery({ some: 'queryPayload' });
    await messageBus.sendQuery(query);

    expect(middleware).toHaveBeenCalledWith(query, expect.any(Function));
  });

  it('should apply middlewares to an event', async () => {
    const handler = new TestEventHandler();
    messageBus.registerEventHandler('TestEvent', handler);

    const middleware = jest.fn((message, next) => next());
    messageBus.use(middleware);

    const event = new TestEvent({ some: 'eventPayload' });
    await messageBus.publishEvent(event);

    expect(middleware).toHaveBeenCalledWith(event, expect.any(Function));
  });

  it('should call the next middleware in the chain', async () => {
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

  it('should continue to run all handlers even if one fails for a command', async () => {
    const handler1 = {
      handle: jest.fn().mockRejectedValue(new Error('Handler 1 failed')),
    };
    const handler2 = {
      handle: jest.fn().mockResolvedValue(undefined),
    };
    messageBus.registerCommandHandler('TestCommand', handler1);
    messageBus.registerCommandHandler('TestCommand', handler2);

    const command = new TestCommand({ some: 'commandPayload' });
    await expect(messageBus.sendCommand(command)).resolves.not.toThrow();

    expect(handler1.handle).toHaveBeenCalled();
    expect(handler2.handle).toHaveBeenCalled();
  });

  it('should continue to run all handlers even if one fails for an event', async () => {
    const handler1 = {
      handle: jest.fn().mockRejectedValue(new Error('Handler 1 failed')),
    };
    const handler2 = {
      handle: jest.fn().mockResolvedValue(undefined),
    };
    messageBus.registerEventHandler('TestEvent', handler1);
    messageBus.registerEventHandler('TestEvent', handler2);

    const event = new TestEvent({ some: 'eventPayload' });
    await expect(messageBus.publishEvent(event)).resolves.not.toThrow();

    expect(handler1.handle).toHaveBeenCalled();
    expect(handler2.handle).toHaveBeenCalled();
  });
});
