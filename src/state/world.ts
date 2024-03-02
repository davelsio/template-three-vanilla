import StateInstance from '@helpers/state-instance';

interface State {
  /**
   * Whether the loading bar has finished animating.
   */
  loadingReady: boolean;

  /**
   * The WebGL views that have finished loading.
   */
  viewsLoaded: string[];

  /**
   * Ratio [0, 1] of viewsLoaded over viewsToLoad.
   */
  viewsProgress: number;

  /**
   * Whether all views have finished loading.
   */
  viewsReady: boolean;
}

export default class WorldState extends StateInstance<State> {
  constructor() {
    super({
      viewsLoaded: [],
      viewsProgress: 0,
      viewsReady: false,
      loadingReady: false,
    });
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
