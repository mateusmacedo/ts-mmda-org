export class SpecificationNotSetError extends Error {
  constructor() {
    super('Initial specification is not set.');
    this.name = 'SpecificationNotSetError';
  }
}
