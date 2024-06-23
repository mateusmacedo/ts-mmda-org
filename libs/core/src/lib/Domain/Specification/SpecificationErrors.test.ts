import { SpecificationNotSetError } from './SpecificationErrors';

describe('SpecificationNotSetError', () => {
  it('should have the correct name', () => {
    const error = new SpecificationNotSetError();
    expect(error.name).toEqual('SpecificationNotSetError');
  });

  it('should have the correct message', () => {
    const error = new SpecificationNotSetError();
    expect(error.message).toEqual('Initial specification is not set.');
  });
});
