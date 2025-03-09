import { Atom, atom } from 'jotai';
import { createStore } from 'jotai';
import { atomFamily } from 'jotai/utils';

export type Store = ReturnType<typeof createStore>;

export type SubscribeArgs<T, R> = [
  /**
   * Jotai store to subscribe to.
   */
  store: Store,
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
     * Namespace the subscription.
     *
     * If provided, the subscriber will be grouped within the provided namespace.
     * Useful for selectively clearing multiple subscriptions at once.
     */
    namespace?: string;
    /**
     * Execute the callback only once and unsubscribe.

     * If a function is provided, it will be called with the result of the
     * callback as an argument. The callback will only be executed once the
     * result of this function is `true`.
     */
    once?: boolean | ((res: R) => boolean | void);
  },
];

export type SubscribeToAtomArgs<T, R> =
  SubscribeArgs<T, R> extends [any, any, ...infer Rest] ? Rest : never;

const _subsFamily = atomFamily((_namespace: string) =>
  atom<(() => void)[]>([])
);

/**
 * Subscribe to an atom.
 * @param args subscription arguments
 */
export function subscribe<V, R>(...args: SubscribeArgs<V, R>) {
  const [store, atom, callback, options] = args;

  const once =
    typeof options?.once === 'function' ? options.once : () => options?.once;

  const listener = () => {
    const res = callback(store.get(atom));
    if (once(res)) {
      unsub();
    }
  };
  const unsub = store.sub(atom, listener);

  const namespace = options?.namespace || 'default';
  const subsAtom = _subsFamily(namespace);
  store.set(subsAtom, (prev) => [...prev, unsub]);

  if (options?.callImmediately) {
    listener();
  }

  return () => {
    store.set(subsAtom, (prev) => prev.filter((sub) => sub !== unsub));
    unsub();
  };
}

/**
 * Clear all subscribers. If a namespace is not provided, the default
 * namespace will be cleared.
 * @param store jotai store
 * @param namespace namespace unique identifier
 */
export function unsub(store: Store, namespace = 'default') {
  const subsAtom = _subsFamily(namespace);
  const subs = store.get(subsAtom);
  subs.forEach((unsub) => unsub());
  _subsFamily.remove(namespace);
}
