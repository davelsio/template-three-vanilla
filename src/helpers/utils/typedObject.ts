/**
 * Return the key-value entries of an object as a 2D array.
 * @param obj object to get the entries from
 */
function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Return an object from an array of key-value pairs.
 * @param entries array of key-value pairs
 */
function objectFromEntries<T>(entries: Array<[keyof T, T[keyof T]]>) {
  return Object.fromEntries(entries) as Record<keyof T, T[keyof T]>;
}

/**
 * Returns the keys of an object as an array.
 * @param obj object to get the keys from
 */
function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Returns the values of an object as an array.
 * @param obj object to get the values from
 */
function objectValues<T extends object>(obj: T) {
  return Object.values(obj) as T[keyof T][];
}

/**
 * Collection of object methods that preserve type inference when used with
 * monadic functions.
 */
export const TypedObject = {
  entries: objectEntries,
  fromEntries: objectFromEntries,
  keys: objectKeys,
  values: objectValues,
};
