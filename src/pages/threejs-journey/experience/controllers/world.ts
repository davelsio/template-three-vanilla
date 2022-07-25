import createStore from 'zustand/vanilla';

import { SceneView } from '../views/scene';

interface State {
  viewsToLoad: string[];
  viewsLoaded: string[];
  viewsProgress: number;
  worldReady: boolean;
  addViews: (views: string[]) => void;
  loadView: (name: string) => void;
}

export class WorldController {
  private static _state = createStore<State>((set, get) => ({
    // Values
    viewsToLoad: [],
    viewsLoaded: [],
    viewsProgress: 0,
    worldReady: false,
    // Mutations
    addViews: (views: string[]) => {
      set((state) => ({ viewsToLoad: [...state.viewsToLoad, ...views] }));
    },
    loadView: (name: string) => {
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

  public static get state() {
    return {
      ...this._state.getState(),
      subscribe: this._state.subscribe,
    };
  }
  public static scene: SceneView;

  public static init() {
    this.scene = new SceneView();
  }

  public static destroy() {
    this.scene.destroy();
    this._state.destroy();
  }
}
