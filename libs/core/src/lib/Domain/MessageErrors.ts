export class RequiredPropsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequiredPropsError';
  }
}

export class InvalidTypesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTypesError';
  }
}
