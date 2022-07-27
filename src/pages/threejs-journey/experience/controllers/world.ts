import { Scene } from 'three';
import { subscribeWithSelector } from 'zustand/middleware';
import createStore from 'zustand/vanilla';

import { Store } from '../store';
import { Fireflies } from '../views/fireflies';
import { Loading } from '../views/loading';
import { Portal } from '../views/portal';

/**
 * API to access the component state.
 */
interface StateProps {
  viewsToLoad: string[];
  viewsLoaded: string[];
  viewsProgress: number;
  viewsReady: boolean;
  loadingReady: boolean;
}

/**
 * API to mutate with the controller state.
 */
interface StateActions {
  /**
   * Set a WebGL view as loaded.
   * @param name namespace of the loaded view
   */
  addViewLoaded: (name: string) => void;

  /**
   * Set the loading view and animation as completed.
   */
  setLoadingReady: () => void;
}

type State = StateProps & StateActions;

export class WorldController {
  private static _loading: Loading;
  private static _portal: Portal;
  private static _fireflies: Fireflies;

  private static _state = createStore(
    subscribeWithSelector<State>((set, get) => ({
      viewsToLoad: [],
      viewsLoaded: [],
      viewsProgress: 0,
      viewsReady: false,
      loadingReady: false,

      addViewLoaded: (name) => {
        set((state) => {
          const viewsLoaded = [...state.viewsLoaded, name];
          const viewsProgress = viewsLoaded.length / state.viewsToLoad.length;
          return { viewsLoaded, viewsProgress };
        });

        if (get().viewsProgress === 1) {
          set({
            viewsReady: true,
          });
        }
      },

      setLoadingReady: () => {
        set({ loadingReady: true });
      },
    }))
  );

  public static namespace = 'WorldController';
  public static get state() {
    return {
      ...this._state.getState(),
      subscribe: this._state.subscribe,
    };
  }

  public static scene: Scene;

  public static init() {
    this.setupScene();
    this.setupSubscriptions();
  }

  public static destroy() {
    this._fireflies.destroy();
    this.scene.remove(this._fireflies);

    this._portal.destroy();
    this.scene.remove(this._portal);

    Store.subscriptions[this.namespace].forEach((unsub) => unsub());
    this._state.destroy();
  }

  private static setupScene() {
    this.scene = new Scene();

    // Load each view constructor, so we have access to their namespaces
    this._loading = new Loading();
    this._portal = new Portal();
    this._fireflies = new Fireflies();

    // Update the state with the views to load
    this._state.setState({
      viewsToLoad: [this._portal.namespace, this._fireflies.namespace],
    });

    // Asynchronously initialize and add each view
    this._loading.init();
    this.scene.add(this._loading);

    this._portal.init();
    this.scene.add(this._portal);

    this._fireflies.init();
    this.scene.add(this._fireflies);
  }

  private static setupSubscriptions() {
    const worldSub = this.state.subscribe(
      (state) => [state.loadingReady, state.viewsReady],
      ([loadingReady, worldReady]) => {
        // Remove the loading progress once the world is ready
        if (loadingReady && worldReady) {
          this._loading.destroy();
          this.scene.remove(this._loading);
        }
      }
    );
    Store.subscriptions[this.namespace].push(worldSub);
  }
}
