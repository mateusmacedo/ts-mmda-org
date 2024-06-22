import { Path } from './IValidator';

export function buildPath(base: string, key: Path): string {
  if (base === '') {
    return key.toString();
  }
  if (typeof key === 'number') {
    return `${base}[${key}]`;
  }
  return `${base}.${key}`;
}
