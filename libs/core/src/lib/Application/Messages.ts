import { IHandler, Message } from '../Domain/Messages';

export abstract class Command<P = unknown, M = unknown> extends Message<P, M> {}

export type TCommandHandler<T extends Command<unknown, unknown>> = IHandler<T>;

export abstract class Query<P = unknown, M = unknown> extends Message<P, M> {}

export interface IQueryHandler<T extends Query<unknown, unknown>, R> {
  handle(query: T): Promise<R>;
}

export abstract class Event<P = unknown, M = unknown> extends Message<P, M> {}

export type TEventHandler<T extends Event<unknown, unknown>> = IHandler<T>;
