import { ValidationError } from './ValidationErrors';

describe('ValidationError', () => {
  it('should create a ValidationError with a path, message, and context', () => {
    const error = new ValidationError('path', 'This is an error message', {
      detail: 'Additional context',
    });
    expect(error.path).toBe('path');
    expect(error.message).toBe('This is an error message');
    expect(error.context).toEqual({ detail: 'Additional context' });
    expect(error.name).toBe('ValidationError');
  });

  it('should create a ValidationError without context', () => {
    const error = new ValidationError('path', 'This is an error message');
    expect(error.path).toBe('path');
    expect(error.message).toBe('This is an error message');
    expect(error.context).toBeUndefined();
    expect(error.name).toBe('ValidationError');
  });
});
