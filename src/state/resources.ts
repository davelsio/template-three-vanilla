import StateInstance from '@helpers/state-instance';

interface StateProps {
  /**
   * Number of assets already loaded.
   */
  assetsLoaded: number;

  /**
   * Total number assets available in the assets pack.
   */
  assetsTotal: number;

  /**
   * Progress ([0,1]) of the asset loading process.
   */
  assetsProgress: number;
}

export default class ResourceState extends StateInstance<StateProps> {
  constructor() {
    super({
      assetsLoaded: 0,
      assetsTotal: 0,
      assetsProgress: 0,
    });
  }

  /**
   * Update the number of total available assets.
   * @param assetsTotal number of total available assets
   */
  public updateTotalAssets(assetsTotal: number) {
    this._state.setState({ assetsTotal });
  }

  /**
   * Update the number of loaded assets.
   * @param loaded number of assets loaded
   */
  public updateLoadedAssets = (loaded: number) =>
    this._state.setState({
      assetsLoaded: loaded,
      assetsProgress: loaded / this._state.getState().assetsTotal,
    });
}
