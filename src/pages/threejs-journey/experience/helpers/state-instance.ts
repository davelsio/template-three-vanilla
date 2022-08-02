import {
  StoreSubscribeWithSelector,
  subscribeWithSelector,
  Write,
} from 'zustand/middleware';
import createStore, { StoreApi } from 'zustand/vanilla';

import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';

export default abstract class StateInstance<T extends object> {
  protected _state: Write<StoreApi<T>, StoreSubscribeWithSelector<T>>;

  protected _subscriptions = defaultDict<Subscription[]>(() => []);

  /**
   * Read-only API to access the component state.
   */
  public get state() {
    return this._state.getState();
  }

  constructor(state: T) {
    this._state = createStore(subscribeWithSelector<T>(() => state)) as Write<
      StoreApi<T>,
      StoreSubscribeWithSelector<T>
    >;
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
   * @param selector Slice of state to watch
   * @param listener Callback function to execute when the slice changes
   * @param options Subscription options
   */
  public subscribe<U>(
    selector: (state: T) => U,
    listener: (selectedState: U, previousSelectedState: U) => void,
    options?: {
      /**
       * Function to use for slice comparison. Default is `Object.is`.
       */
      equalityFn?: (a: U, b: U) => boolean;

      /**
       * Do not batch multiple state changes into a single listener event.
       */
      fireImmediately?: boolean;

      /**
       * Define a namespace to associate the listener with. Calling the
       * `unsubscribe` API will clear all listeners for the given namespace.
       */
      namespace?: string;
    }
  ) {
    const unsub = this._state.subscribe(selector, listener, options);
    if (options?.namespace) {
      this._subscriptions[options.namespace].push(unsub);
    }
    return unsub;
  }

  /**
   * Unsubscribe to all listeners from a specific namespace.
   * @param namespace namespace listeners to remove
   */
  public unsubscribe(namespace: string) {
    this._subscriptions[namespace].forEach((unsub) => unsub());
  }
}
