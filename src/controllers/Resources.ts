import {
  CubeTextureAssets,
  GLTFModelAssets,
  TextureAssets,
} from '@loaders/assets';
import { ResourceLoader } from '@loaders/ResourceLoader';
import { Store } from '@state/store';
import { TypedObject } from '@utils/typedObject';
import { CubeTexture, Texture } from 'three';
import { GLTF } from 'three-stdlib';

export interface SourceAssets {
  cubeTextures: CubeTextureAssets;
  textures: TextureAssets;
  gltfs: GLTFModelAssets;
}

export interface LoadedAssets {
  cubeTexture: Record<string, CubeTexture>;
  texture: Record<string, Texture>;
  gltf: Record<string, GLTF>;
}

export class ResourceController {
  /**
   * Available _total_ assets.
   */
  private _sourceAssets: SourceAssets;

  /**
   * Available assets _loaded_.
   */
  private _loadedAssets: LoadedAssets;

  constructor(
    cubeTextures: CubeTextureAssets,
    textures: TextureAssets,
    gltfs: GLTFModelAssets
  ) {
    this._sourceAssets = {
      cubeTextures,
      textures,
      gltfs,
    };

    this._loadedAssets = {
      cubeTexture: {} as LoadedAssets['cubeTexture'],
      texture: {} as LoadedAssets['texture'],
      gltf: {} as LoadedAssets['gltf'],
    };

    const cubeTextureCount = TypedObject.keys(cubeTextures).length;
    const textureCount = TypedObject.keys(textures).length;
    const gltfCount = TypedObject.keys(gltfs).length;
    const totalAssets = cubeTextureCount + textureCount + gltfCount;

    Store.resources.updateTotalAssets(totalAssets);
    ResourceLoader.init(this._sourceAssets, this._loadedAssets);
  }

  public destroy() {
    //
  }
}
