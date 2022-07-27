import { ResourceLoader } from '../loaders';
import { resourceStore } from '../store';
import { Assets, LoadedAssets } from '../types/resources';

export class ResourceController {
  /**
   * Available _total_ assets.
   */
  private static _sourceAssets: Assets;

  /**
   * Available assets _loaded_.
   */
  private static _loadedAssets: LoadedAssets;

  public static init(assets: Assets) {
    this._sourceAssets = assets;
    this._loadedAssets = {
      cubeTexture: {},
      texture: {},
      gltf: {},
    };

    resourceStore.update({
      assetsTotal: this._sourceAssets.length,
    });

    ResourceLoader.init(this._sourceAssets, this._loadedAssets);
  }

  public static destroy() {
    //
  }
}
