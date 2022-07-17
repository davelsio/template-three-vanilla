import { BehaviorSubject } from 'rxjs';

import { ResourceLoader } from '../loaders';
import { Assets, LoadedAssets } from '../types/resources';

export class ResourceController {
  /**
   * Available assets _total_.
   */
  private static _sourceAssets: Assets;

  /**
   * Available assets _loaded_.
   */
  private static _loadedAssets: LoadedAssets;

  /**
   * Total number assets available in the sources pack.
   */
  private static _assetsTotal = 0;

  private static _state = new BehaviorSubject({
    /**
     * Number of assets already loaded.
     */
    assetsLoaded: 0,
    /**
     * Number of ssets required by the application.
     */
    assetsToLoad: 0,
    /**
     * Progress ([0,1]) of the asset loading process.
     */
    assetsProgress: 0,
  });

  public static get state() {
    return {
      ...this._state.getValue(),
      subscribe: this._state.subscribe.bind(this._state),
    };
  }

  public static init(assets: Assets) {
    this._sourceAssets = assets;
    this._assetsTotal = assets.length;
    this._loadedAssets = {
      cubeTexture: {},
      texture: {},
      gltf: {},
    };

    ResourceLoader.init(this._sourceAssets, this._loadedAssets);
  }

  public static destroy() {
    this._state.complete();
  }

  /* MUTATIONS */

  public static updateAssetProgress(loaded: number, total: number) {
    this._state.next({
      assetsLoaded: loaded,
      assetsToLoad: total,
      assetsProgress: loaded / total,
    });
  }
}
