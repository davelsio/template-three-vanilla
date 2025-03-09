import { CubeTextureLoader, LoadingManager, TextureLoader } from 'three';
import { DRACOLoader, GLTFLoader, RGBELoader } from 'three-stdlib';

import { TypedObject } from '@helpers/utils';

type LoaderOptions = {
  onProgress?: (event: ProgressEvent) => void;
};

type InitOptions = {
  draco?: boolean;
  loadingManager?: LoadingManager;
};

export type CubeTextureAssets = Record<string, string[]>;
export type DataTextureAssets = Record<string, string>;
export type TextureAssets = Record<string, string>;
export type GLTFAssets = Record<string, string>;

export type ResourceLoaderParams<
  CubeTextures extends CubeTextureAssets,
  DataTextures extends DataTextureAssets,
  Textures extends TextureAssets,
  GLTFs extends GLTFAssets,
> = {
  cubeTextures?: CubeTextures;
  dataTextures?: DataTextures;
  textures?: Textures;
  gltfs?: GLTFs;
  options?: InitOptions;
};

export enum AssetType {
  CubeTexture = 'cubeTexture',
  DataTexture = 'dataTexture',
  GLTF = 'gltf',
  Texture = 'texture',
}

export class ResourceLoader<
  CubeTextures extends CubeTextureAssets,
  DataTextures extends DataTextureAssets,
  Textures extends TextureAssets,
  GLTFs extends GLTFAssets,
> {
  private readonly _assets: {
    cubeTextures: CubeTextures;
    dataTextures: DataTextures;
    textures: Textures;
    gltfs: GLTFs;
  };

  private readonly _loadingManager?: LoadingManager;
  private _cubeTextureLoader: CubeTextureLoader;
  private _rgbeLoader: RGBELoader;
  private _textureLoader: TextureLoader;
  private _gltfLoader: GLTFLoader;

  public constructor(
    args: ResourceLoaderParams<CubeTextures, DataTextures, Textures, GLTFs>
  ) {
    this._assets = {
      cubeTextures: args.cubeTextures ?? {},
      dataTextures: args.dataTextures ?? {},
      textures: args.textures ?? {},
      gltfs: args.gltfs ?? {},
    } as typeof this._assets;

    this._loadingManager = args.options?.loadingManager;
    this._cubeTextureLoader = new CubeTextureLoader(this._loadingManager);
    this._rgbeLoader = new RGBELoader(this._loadingManager);
    this._textureLoader = new TextureLoader(this._loadingManager);
    this._gltfLoader = new GLTFLoader(this._loadingManager);

    if (args.options?.draco) {
      const dracoLoader = new DRACOLoader();
      this._gltfLoader.setDRACOLoader(dracoLoader);
      dracoLoader.setDecoderPath('draco/'); // from node_modules/three/examples/js/libs/draco/
    }
  }

  /* LOADERS */

  public async loadCubeTexture(
    name: keyof CubeTextures,
    options?: LoaderOptions
  ) {
    const source = this._assets.cubeTextures[name];
    if (!source) {
      throw new AssetNotFoundError(name as string, AssetType.CubeTexture);
    }

    return await this._cubeTextureLoader.loadAsync(source, options?.onProgress);
  }

  public async loadRgbeTexture(
    name: keyof DataTextures,
    options?: LoaderOptions
  ) {
    const source = this._assets.dataTextures[name];
    if (!source) {
      throw new AssetNotFoundError(name as string, AssetType.DataTexture);
    }

    return await this._rgbeLoader.loadAsync(source, options?.onProgress);
  }

  public async loadTexture(name: keyof Textures, options?: LoaderOptions) {
    const source = this._assets.textures[name];
    if (!source) {
      throw new AssetNotFoundError(name as string, AssetType.Texture);
    }

    const texture = await this._textureLoader.loadAsync(
      source,
      options?.onProgress
    );
    texture.name = name.toString();
    return texture;
  }

  public async loadAllTextures(options?: LoaderOptions) {
    const texturePromises = TypedObject.keys(this._assets.textures).map(
      (name) => this.loadTexture(name, options)
    );

    return Promise.all(texturePromises);
  }

  public async loadGltfModel(name: keyof GLTFs, options?: LoaderOptions) {
    const source = this._assets.gltfs[name];
    if (!source) {
      throw new AssetNotFoundError(name as string, AssetType.GLTF);
    }

    return await this._gltfLoader.loadAsync(source, options?.onProgress);
  }
}

export class AssetNotFoundError extends Error {
  public constructor(asset: string, type: AssetType) {
    super(`Asset of type "${type}" not found: ${asset}`);
  }
}
