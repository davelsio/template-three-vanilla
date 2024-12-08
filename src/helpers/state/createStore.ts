import { Atom, atom, createStore as JotaiCreateStore } from 'jotai';
import { atomFamily } from 'jotai/utils';

export type SubToAtomArgs<T, R> = [
  /**
   * Atom to subscribe.
   */
  atom: Atom<T>,
  /**
   * Function to execute when the atom state changes.
   */
  callback: (value: T) => R,
  /**
   * Subscription options.
   */
  options?: {
    /**
     * Execute the callback when the atom mounts.
     */
    callImmediately?: boolean;
    /**
     * Execute thec callback only once and unsubscribe.
     */
    once?: boolean | ((res: R) => boolean | void);
  },
];

export type State = ReturnType<typeof createState>;
export type Store = State['store'];

export function createState() {
  const store = JotaiCreateStore();

  const subsFamily = atomFamily((_namespace: string) =>
    atom<(() => void)[]>([])
  );

  function subToAtom<T, R>(namespace: string, ...args: SubToAtomArgs<T, R>) {
    const [atom, callback, options] = args;

    const once =
      typeof options?.once === 'function' ? options.once : () => options?.once;

    const listener = () => {
      const res = callback(store.get(atom));
      once(res) && unsub();
    };
    const unsub = store.sub(atom, listener);

    const subsAtom = subsFamily(namespace);
    store.set(subsAtom, (prev) => [...prev, unsub]);

    if (options?.callImmediately) {
      listener();
    }

    return () => {
      store.set(subsAtom, (prev) => prev.filter((sub) => sub !== unsub));
      unsub();
    };
  }

  function unSubAll(namespace: string) {
    const subsAtom = subsFamily(namespace);
    store.get(subsAtom).forEach((unsub) => unsub());
    subsFamily.remove(namespace);
  }

  return {
    store,
    subToAtom,
    unSubAll,
  };
}
