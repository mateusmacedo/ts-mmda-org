import { InvalidTypesError, RequiredPropsError } from './MessageErrors';

export type TMessageMetadata<T = unknown> = {
  [Property in keyof T]?: T[Property];
};

export type TMessagePayload<P = unknown> = {
  [Property in keyof P]?: P[Property];
};

export enum EMessageStatus {
  CREATED = 'CREATED',
}

export type TMessageProps<P = unknown, M = unknown> = {
  id: string;
  type: string;
  status: EMessageStatus;
  payload: TMessagePayload<P>;
  metadata: TMessageMetadata<M>;
  timestamp: number;
};

export interface IMessage<P = unknown, M = unknown> {
  get id(): string;
  get type(): string;
  get status(): EMessageStatus;
  get payload(): TMessagePayload<P>;
  get metadata(): TMessageMetadata<M>;
  get timestamp(): number;
}

export abstract class Message<P = unknown, M = unknown> implements IMessage<P, M> {
  private readonly props: Readonly<TMessageProps<P, M>>;

  constructor(props: TMessageProps<P, M>) {
    // Validate required properties
    if (!props.id || !props.type || !props.timestamp) {
      throw new RequiredPropsError('Missing required properties: id, type, or timestamp');
    }

    if (
      typeof props.id !== 'string' ||
      typeof props.type !== 'string' ||
      typeof props.timestamp !== 'number' ||
      !Object.values(EMessageStatus).includes(props.status)
    ) {
      throw new InvalidTypesError(
        'Invalid types for properties: id (string), type (string), timestamp (number), status (MessageStatus)',
      );
    }

    if (props.payload && typeof props.payload !== 'object') {
      throw new InvalidTypesError('Invalid type for payload: should be an object');
    }

    if (props.metadata && typeof props.metadata !== 'object') {
      throw new InvalidTypesError('Invalid type for metadata: should be an object');
    }

    this.props = Object.freeze(props);
  }

  get id(): string {
    return this.props.id;
  }

  get type(): string {
    return this.props.type;
  }

  get status(): EMessageStatus {
    return this.props.status;
  }

  get payload(): TMessagePayload<P> {
    return this.props.payload;
  }

  get metadata(): TMessageMetadata<M> {
    return this.props.metadata;
  }

  get timestamp(): number {
    return this.props.timestamp;
  }
}

export interface IHandler<T extends IMessage<unknown, unknown>> {
  handle(message: T): Promise<void>;
}
