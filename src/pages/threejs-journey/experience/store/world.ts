import {
  StoreSubscribeWithSelector,
  subscribeWithSelector,
  Write,
} from 'zustand/middleware';
import createStore, { StoreApi } from 'zustand/vanilla';

import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';

/**
 * API to access the component state.
 */
interface State {
  viewsLoaded: string[];
  viewsProgress: number;
  viewsReady: boolean;
  loadingReady: boolean;
}

export default class WorldState {
  private _state: Write<StoreApi<State>, StoreSubscribeWithSelector<State>>;

  private _subscriptions = defaultDict<Subscription[]>(() => []);

  public get state() {
    return this._state.getState();
  }

  constructor() {
    this._state = createStore(
      subscribeWithSelector<State>(() => ({
        viewsLoaded: [],
        viewsProgress: 0,
        viewsReady: false,
        loadingReady: false,
      }))
    );
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
    selector: (state: State) => U,
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

  /* ACTIONS */

  /**
   * Set a WebGL view as loaded.
   * @param name namespace of the loaded view
   */
  public addViewLoaded(name: string) {
    this._state.setState((state) => ({
      viewsLoaded: [...state.viewsLoaded, name],
    }));
  }

  /**
   * Set the loading view and animation as completed.
   */
  public setLoadingReady() {
    this._state.setState({ loadingReady: true });
  }

  /**
   * Update progress
   * @param viewsProgress unit percent of views loaded
   */
  public updateProgress(viewsProgress: number) {
    this._state.setState({
      viewsProgress,
      viewsReady: viewsProgress === 1,
    });
  }
}
