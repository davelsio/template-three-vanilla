/**
 * Picks a random element from an array.
 * @param array array of elements
 */
export function arrayPickRandom<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}
