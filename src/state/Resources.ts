import { StoreInstance } from '@helpers/classes/StoreInstance';

interface ResourceState {
  /**
   * Number of assets already loaded.
   */
  loadedAssets: number;
  /**
   * Asset loading progress ([0,1]).
   */
  loadingProgress: number;
  /**
   * Total number assets available in the sources pack.
   */
  totalAssets: number;
}

export class ResourceStore extends StoreInstance<ResourceState> {
  constructor() {
    super({
      loadedAssets: 0,
      loadingProgress: 0,
      totalAssets: 0,
    });
  }

  /**
   * Update the number of total available assets.
   * @param assetsTotal number of total available assets
   */
  public updateTotalAssets(assetsTotal: number) {
    this._state.setState({ totalAssets: assetsTotal });
  }

  /**
   * Update the number of loaded assets.
   */
  public notifyAssetLoaded = () => {
    this._state.setState((state) => {
      const loadedAssets = state.loadedAssets + 1;
      return {
        loadedAssets,
        loadingProgress: loadedAssets / this._state.getState().totalAssets,
      };
    });
  };
}
