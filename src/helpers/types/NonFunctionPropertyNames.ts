/**
 * Get the non-function keys of a given type.
 */
export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : T[K];
};
