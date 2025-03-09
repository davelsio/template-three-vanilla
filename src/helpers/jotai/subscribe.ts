import { Atom } from 'jotai';
import { createStore } from 'jotai';

export type Store = ReturnType<typeof createStore>;

export function subscribe<V, A extends Atom<V>>(
  store: Store,
  atom: A,
  callback: () => void,
  callImmediately = false
) {
  const unsub = store.sub(atom, callback);
  if (callImmediately) {
    callback();
  }
  return unsub;
}
