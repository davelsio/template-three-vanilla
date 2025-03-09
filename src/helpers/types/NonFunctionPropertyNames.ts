/**
 * Get the non-function keys of a given type.
 */
export type NonFunctionPropertyNames<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};
