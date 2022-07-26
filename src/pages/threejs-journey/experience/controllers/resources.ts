import createStore from 'zustand/vanilla';

import { ResourceLoader } from '../loaders';
import { Assets, LoadedAssets } from '../types/resources';

interface State {
  /**
   * Number of assets already loaded.
   */
  assetsLoaded: number;

  /**
   * Total number assets available in the sources pack.
   */
  assetsTotal: number;

  /**
   * Progress ([0,1]) of the asset loading process.
   */
  assetsProgress: number;

  /**
   * Update the asset loading progress.
   * @param loaded number of assets loaded
   */
  updateAssets: (loaded: number) => void;
}

export class ResourceController {
  /**
   * Available _total_ assets.
   */
  private static _sourceAssets: Assets;

  /**
   * Available assets _loaded_.
   */
  private static _loadedAssets: LoadedAssets;

  private static _state = createStore<State>((set, get) => ({
    assetsLoaded: 0,
    assetsTotal: 0,
    assetsProgress: 0,
    updateAssets: (loaded) =>
      set({
        assetsLoaded: loaded,
        assetsProgress: loaded / get().assetsTotal,
      }),
  }));

  public static get state() {
    return {
      ...this._state.getState(),
      subscribe: this._state.subscribe.bind(this._state),
    };
  }

  public static init(assets: Assets) {
    this._sourceAssets = assets;
    this._loadedAssets = {
      cubeTexture: {},
      texture: {},
      gltf: {},
    };

    this._state.setState({
      assetsTotal: this._sourceAssets.length,
    });

    ResourceLoader.init(this._sourceAssets, this._loadedAssets);
  }

  public static destroy() {
    this._state.destroy();
  }
}
