import { Atom, atom, createStore } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const appStore = createStore();

const subsFamily = atomFamily((_namespace: string) => atom<(() => void)[]>([]));

export type SubToAtomArgs<T, R> = [
  atom: Atom<T>,
  callback: (value: T) => R,
  options?: {
    callImmediately?: boolean;
    once?: boolean | ((res: R) => boolean | void);
  },
];

export function subToAtom<T, R>(
  namespace: string,
  ...args: SubToAtomArgs<T, R>
) {
  const [atom, callback, options] = args;

  const once =
    typeof options?.once === 'function' ? options.once : () => options?.once;

  const listener = () => {
    const res = callback(appStore.get(atom));
    once(res) && unsub();
  };
  const unsub = appStore.sub(atom, listener);

  const subsAtom = subsFamily(namespace);
  appStore.set(subsAtom, (prev) => [...prev, unsub]);

  if (options?.callImmediately) {
    listener();
  }

  return () => {
    appStore.set(subsAtom, (prev) => prev.filter((sub) => sub !== unsub));
    unsub();
  };
}

export function unSubAll(namespace: string) {
  const subsAtom = subsFamily(namespace);
  appStore.get(subsAtom).forEach((unsub) => unsub());
  subsFamily.remove(namespace);
}
