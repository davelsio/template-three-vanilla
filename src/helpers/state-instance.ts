import { subscribeWithSelector } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';

export default abstract class StateInstance<T extends object> {
  protected _state: ReturnType<
    typeof createStore<T, [['zustand/subscribeWithSelector', never]]>
  >;

  protected _subscriptions = defaultDict<Subscription[]>(() => []);

  /**
   * Read-only API to access the component state.
   */
  public get state() {
    return this._state.getState();
  }

  constructor(state: T) {
    this._state = createStore(subscribeWithSelector<T>(() => state));
  }

  /* API */

  /**
   * Clear the store subscribers.
   */
  public destroy() {
    this._state.destroy();
  }

  /**
   * Subscribe to a slice of the world state.
   * @param subscription subscription selector, listener, and options
   */
  public subscribe<U>(
    ...subscription: Parameters<typeof this._state.subscribe<U>>
  ) {
    return this._state.subscribe<U>(...subscription);
  }

  /**
   * Subscribe to a namespaced slice of the state. Namespaced subscriptions
   * can be selectively removed using the `unsubscribe` method.
   * @param namespace namespace to associate with the listener
   * @param subscription subscription selector, listener, and options
   */
  public subscribeNs<U>(
    namespace: string,
    ...subscription: Parameters<typeof this._state.subscribe<U>>
  ) {
    const unsub = this.subscribe(...subscription);
    this._subscriptions[namespace].push(unsub);
    return unsub;
  }

  /**
   * Get a namespaced subscriber for a slice of the state. Namespaced
   * subscriptions can be selectively removed using the `unsubscribe` method.
   * @param namespace namespace to associate with the listener
   */
  public subscriberFactory(namespace: string) {
    return <U>(
      ...subscription: Parameters<typeof this._state.subscribe<U>>
    ) => {
      return this.subscribeNs(namespace, ...subscription);
    };
  }

  /**
   * Unsubscribe to all listeners from a specific namespace.
   * @param namespace namespace listeners to remove
   */
  public unsubscribe(namespace: string) {
    this._subscriptions[namespace].forEach((unsub) => unsub());
  }
}
