import { NonFunctionPropertyNames } from './NonFunctionPropertyNames';

/**
 * Get the non-function props of a given class.
 */
export type ClassProps<T extends abstract new (...args: any) => any> =
  NonFunctionPropertyNames<InstanceType<T>>;
