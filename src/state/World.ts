import { StoreInstance } from '@helpers/StoreInstance';

interface WorldState {
  /**
   * The WebGL views that need to be loaded.
   */
  viewsToLoad: string[];
  /**
   * The WebGL views that have finished loading.
   */
  viewsLoaded: string[];
  /**
   * Ratio [0, 1] of viewsLoaded over viewsToLoad.
   */
  viewsProgress: number;
}

export class WorldStore extends StoreInstance<WorldState> {
  constructor() {
    super({
      viewsToLoad: [],
      viewsLoaded: [],
      viewsProgress: 0,
    });
  }

  /* ACTIONS */

  public addViewsToLoad(name: string) {
    this._state.setState((state) => ({
      viewsToLoad: [...state.viewsToLoad, name],
    }));
  }

  /**
   * Set a WebGL view as loaded.
   * @param name namespace of the loaded view
   */
  public addViewLoaded(name: string) {
    this._state.setState((state) => {
      const viewsLoaded = [...state.viewsLoaded, name];
      const viewsProgress = state.viewsToLoad.length / viewsLoaded.length;
      return {
        viewsLoaded,
        viewsProgress,
      };
    });
  }
}
