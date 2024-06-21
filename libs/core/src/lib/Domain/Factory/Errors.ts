export class TargetConstructorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TargetConstructorError';
  }
}

export class InvalidPropsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPropsError';
  }
}

export class InstanceCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstanceCreationError';
  }
}
