import { parseRecord } from '@tweakpane/core';

interface Acceptance<T, P> {
  initialValue: T;
  params: P;
}

type Accept<Ex, P> = (value: Ex, params: P) => Acceptance<Ex, P> | null;
type AcceptValue<T> = T extends Record<string, infer V> ? V : never;

export function customAccept<
  T extends Record<string, unknown>,
  A extends Accept<AcceptValue<T>, T>,
>(accept: A) {
  return (value: AcceptValue<T>, params: T) => {
    const result = accept(value, params);
    if (result) {
      result.params = {
        ...result.params,
        ...parseRecord(params, (p) => ({
          _reader: p.optional.function,
          _writer: p.optional.function,
        })),
      };
    }
    return result as ReturnType<typeof accept>;
  };
}
