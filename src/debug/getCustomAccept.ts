import { parseRecord } from '@tweakpane/core';

export function getCustomAccept<T extends Record<string, unknown>>(params: T) {
  return parseRecord(params, (p) => ({
    _reader: p.optional.function,
    _writer: p.optional.function,
  }));
}

export function getCustomAcceptReadOnly<T extends Record<string, unknown>>(
  params: T
) {
  return parseRecord(params, (p) => ({
    _reader: p.optional.function,
  }));
}
