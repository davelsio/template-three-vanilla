export function defaultDict<T>(createValueFn: () => T) {
  return new Proxy(Object.create(null) as Record<string | symbol, T>, {
    get(target, property) {
      if (!(property in target)) {
        target[property] = createValueFn();
      }
      return target[property];
    },
  });
}
