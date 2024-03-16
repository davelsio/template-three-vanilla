import { StoreApi } from 'zustand';
import {
  StoreSubscribeWithSelector,
  subscribeWithSelector,
  Write,
} from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Settings } from '@controllers/Debug';
import { defaultDict } from '@utils/defaultDict';

export type Subscription = () => void;

export abstract class StoreInstance<T extends Settings> {
  public namespace: string;
  protected _state: Write<StoreApi<T>, StoreSubscribeWithSelector<T>>;
  protected _subscriptions = defaultDict<Subscription[]>(() => []);

  /**
   * Read-only API to access the component state.
   */
  public get state() {
    return this._state.getState();
  }

  constructor(namespace: string, state: T) {
    this.namespace = namespace;
    this._state = createStore(subscribeWithSelector<T>(() => state));
  }

  /* API */

  /**
   * Clear the store subscribers.
   */
  public destroy() {
    Object.values(this._subscriptions).forEach((sub) =>
      sub.forEach((unsub) => unsub())
    );
  }

  /**
   * Subscribe to a namespaced slice of the state. Namespaced subscriptions
   * can be selectively removed using the `unsubscribe` method.
   * @param namespace namespace to associate with the listener
   * @param subscription subscription selector, listener, and options
   */
  public subscribe<U>(
    namespace: string,
    ...subscription: Parameters<typeof this._state.subscribe<U>>
  ) {
    const options = subscription[2];
    if (options?.unique && this._subscriptions[namespace].length > 0) {
      return () => {};
    }
    const unsub = this._state.subscribe<U>(...subscription);
    this._subscriptions[namespace].push(unsub);
    return unsub;
  }

  /**
   * Get a namespaced subscriber for a slice of the state. Namespaced
   * subscriptions can be selectively removed using the `unsubscribe` method.
   * @param namespace namespace to associate with the listener
   */
  public getSubscriber(namespace: string) {
    return <U>(
      ...subscription: Parameters<typeof this._state.subscribe<U>>
    ) => {
      return this.subscribe(namespace, ...subscription);
    };
  }

  /**
   * Unsubscribe to all listeners from a specific namespace.
   * @param namespace namespace listeners to remove
   */
  public unsubscribe(namespace: string) {
    this._subscriptions[namespace].forEach((unsub) => unsub());
  }

  /**
   * Update the store state.
   * @param state partial state
   */
  public update = (state: Partial<T>) => {
    this._state.setState(state);
  };
}
