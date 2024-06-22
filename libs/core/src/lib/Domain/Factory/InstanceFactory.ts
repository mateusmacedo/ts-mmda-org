import { InstanceCreationError, InvalidPropsError, TargetConstructorError } from './FactoryErrors';

export interface Factory {
  create<T>(target: new (...args: unknown[]) => T, props?: ConstructorParameters<typeof target>): T;
}

export class BasicFactory implements Factory {
  create<T>(
    target: new (...args: unknown[]) => T,
    props?: ConstructorParameters<typeof target>,
  ): T {
    if (!target) {
      throw new TargetConstructorError('Target constructor is required');
    }

    if (props && !Array.isArray(props)) {
      throw new InvalidPropsError('Props must be an array if provided');
    }

    try {
      const instance = new target(...(props ?? []));
      return instance;
    } catch (error) {
      throw new InstanceCreationError(
        `Could not create instance of ${target.name}: ${error.message}`,
      );
    }
  }
}
