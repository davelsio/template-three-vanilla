import { LoadedAssets, ResourceLoader } from '@loaders/resources';
import { Assets } from '@loaders/sources';
import { Store } from '@state/store';

export class ResourceController {
  /**
   * Available _total_ assets.
   */
  private _sourceAssets: Assets;

  /**
   * Available assets _loaded_.
   */
  private _loadedAssets: LoadedAssets;

  constructor(assets: Assets) {
    this._sourceAssets = assets;
    this._loadedAssets = {
      cubeTexture: {},
      texture: {},
      gltf: {},
    };

    Store.resources.updateTotalAssets(this._sourceAssets.length);
    ResourceLoader.init(this._sourceAssets, this._loadedAssets);
  }

  public destroy() {
    //
  }
}
