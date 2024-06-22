import { IMessage } from '../Domain/Messages';
import { Command, Event, IQueryHandler, Query, TCommandHandler, TEventHandler } from './Messages';

export type Middleware<T extends IMessage<unknown, unknown>> = (
  message: T,
  next: () => void | Promise<void>,
) => void | Promise<void>;

export interface MessageBus {
  use(middleware: Middleware<IMessage<unknown, unknown>>): void;
  registerCommandHandler<T extends Command<unknown, unknown>>(
    commandType: string,
    handler: TCommandHandler<T>,
  ): void;
  sendCommand<T extends Command<unknown, unknown>>(command: T): Promise<void>;
  registerQueryHandler<T extends Query<unknown, unknown>, R>(
    queryType: string,
    handler: IQueryHandler<T, R>,
  ): void;
  sendQuery<T extends Query<unknown, unknown>, R>(query: T): Promise<R>;
  registerEventHandler<T extends Event<unknown, unknown>>(
    eventType: string,
    handler: TEventHandler<T>,
  ): void;
  publishEvent<T extends Event<unknown, unknown>>(event: T): Promise<void>;
}

export class BasicMessageBus implements MessageBus {
  constructor(
    private commandHandlers: Map<string, TCommandHandler<Command<unknown, unknown>>> = new Map(),
    private queryHandlers: Map<string, IQueryHandler<Query<unknown, unknown>, unknown>> = new Map(),
    private eventHandlers: Map<string, TEventHandler<Event<unknown, unknown>>[]> = new Map(),
    private middlewares: Middleware<IMessage<unknown, unknown>>[] = [],
  ) {}

  use(middleware: Middleware<IMessage<unknown, unknown>>): void {
    this.middlewares.push(middleware);
  }

  registerCommandHandler<T extends Command<unknown, unknown>>(
    commandType: string,
    handler: TCommandHandler<T>,
  ): void {
    this.commandHandlers.set(commandType, handler);
  }

  async sendCommand<T extends Command<unknown, unknown>>(command: T): Promise<void> {
    const handler = this.commandHandlers.get(command.type) as TCommandHandler<T>;
    if (!handler) {
      throw new Error(`No handler registered for command type ${command.type}`);
    }
    await this.applyMiddlewares(command, async () => handler.handle(command));
  }

  registerQueryHandler<T extends Query<unknown, unknown>, R>(
    queryType: string,
    handler: IQueryHandler<T, R>,
  ): void {
    this.queryHandlers.set(queryType, handler);
  }

  async sendQuery<T extends Query<unknown, unknown>, R>(query: T): Promise<R> {
    const handler = this.queryHandlers.get(query.type) as IQueryHandler<T, R>;
    if (!handler) {
      throw new Error(`No handler registered for query type ${query.type}`);
    }
    let result: R;
    await this.applyMiddlewares(query, async () => {
      result = await handler.handle(query);
    });
    return result;
  }

  registerEventHandler<T extends Event<unknown, unknown>>(
    eventType: string,
    handler: TEventHandler<T>,
  ): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventType, handlers);
  }

  async publishEvent<T extends Event<unknown, unknown>>(event: T): Promise<void> {
    const handlers = this.eventHandlers.get(event.type) || [];
    if (handlers.length === 0) {
      return;
    }

    for (const handler of handlers) {
      await this.applyMiddlewares(event, () => handler.handle(event));
    }
  }

  private async applyMiddlewares<T extends IMessage<unknown, unknown>>(
    message: T,
    finalHandler: () => void | Promise<void>,
  ): Promise<void> {
    const executeMiddleware = (index: number): void | Promise<void> => {
      if (index === this.middlewares.length) {
        return finalHandler();
      }
      const middleware = this.middlewares[index];
      return middleware(message, () => executeMiddleware(index + 1));
    };

    await executeMiddleware(0);
  }
}
