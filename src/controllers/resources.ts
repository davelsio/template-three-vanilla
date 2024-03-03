import { Asset } from '@loaders/assets';
import { LoadedAssets, ResourceLoader } from '@loaders/resources';
import { Store } from '@state/store';

export class ResourceController {
  /**
   * Available _total_ assets.
   */
  private _sourceAssets: Asset[];

  /**
   * Available assets _loaded_.
   */
  private _loadedAssets: LoadedAssets;

  constructor(assets: Asset[]) {
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
