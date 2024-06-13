import { buildPath } from './Helpers';

describe('buildPath', () => {
  it('should return the key as path if base is empty', () => {
    expect(buildPath('', 'key')).toBe('key');
    expect(buildPath('', 0)).toBe('0');
  });

  it('should return path with dot notation if key is a string', () => {
    expect(buildPath('base', 'key')).toBe('base.key');
  });

  it('should return path with bracket notation if key is a number', () => {
    expect(buildPath('base', 0)).toBe('base[0]');
  });
});
