import { Scene } from 'three';
import createStore from 'zustand/vanilla';

import { Store } from '../store';
import { Fireflies } from '../views/fireflies';
import { Loading } from '../views/loading';
import { Portal } from '../views/portal';

interface State {
  viewsToLoad: string[];
  viewsLoaded: string[];
  viewsProgress: number;
  worldReady: boolean;
  addViews: (views: string[]) => void;
  loadView: (name: string) => void;
}

export class WorldController {
  private static _loading: Loading;
  private static _portal: Portal;
  private static _fireflies: Fireflies;

  private static _state = createStore<State>((set, get) => ({
    viewsToLoad: [],
    viewsLoaded: [],
    viewsProgress: 0,
    worldReady: false,

    addViews: (views) => {
      set((state) => ({ viewsToLoad: [...state.viewsToLoad, ...views] }));
    },

    loadView: (name) => {
      set((state) => {
        const viewsLoaded = [...state.viewsLoaded, name];
        const viewsProgress = viewsLoaded.length / state.viewsToLoad.length;
        return { viewsLoaded, viewsProgress };
      });

      if (get().viewsProgress === 1) {
        setTimeout(() => {
          set({
            worldReady: true,
          });
        }, 800);
      }
    },
  }));

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

    // Update the WorldController state with the views to load
    this.state.addViews([this._portal.namespace, this._fireflies.namespace]);

    // Asynchronously initialize and add each view
    this._loading.init();
    this.scene.add(this._loading);

    this._portal.init();
    this.scene.add(this._portal);

    this._fireflies.init();
    this.scene.add(this._fireflies);
  }

  private static setupSubscriptions() {
    const worldSub = this.state.subscribe((state) => {
      // Remove the loading progress once the world is ready
      if (state.worldReady) {
        this._loading.destroy();
        this.scene.remove(this._loading);
      }
    });
    Store.subscriptions[this.namespace].push(worldSub);
  }
}
