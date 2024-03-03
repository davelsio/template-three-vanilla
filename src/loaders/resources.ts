import { Asset } from '@loaders/assets';
import {
  CubeTexture,
  CubeTextureLoader,
  LoadingManager,
  Texture,
  TextureLoader,
} from 'three';
import { DRACOLoader, GLTF, GLTFLoader } from 'three-stdlib';

interface LoaderOptions {
  onProgress?: (event: ProgressEvent) => void;
}

interface InitOptions {
  loadingManager: LoadingManager;
  draco?: boolean;
}

/* ASSET TYPES */
export interface CubeTextureResource {
  type: 'cubeTexture';
  name: string;
  path: string[];
  file?: CubeTexture;
}

export interface TextureResource {
  type: 'texture';
  name: string;
  path: string;
  file?: Texture;
}

export interface GLTFModelResource {
  type: 'gltf';
  name: string;
  path: string;
  file?: GLTF;
}

export type AssetType = (
  | CubeTextureResource
  | TextureResource
  | GLTFModelResource
)['type'];
export type LoadedAsset = Required<
  CubeTextureResource | TextureResource | GLTFModelResource
>;

export interface LoadedAssets {
  cubeTexture: {
    [key: string]: Required<CubeTextureResource>;
  };
  texture: {
    [key: string]: Required<TextureResource>;
  };
  gltf: {
    [key: string]: Required<GLTFModelResource>;
  };
}

export class ResourceLoader {
  private static _assets: Asset[];
  private static _cache: LoadedAssets;

  private static _loadingManager?: LoadingManager;
  private static _cubeTextureLoader: CubeTextureLoader;
  private static _textureLoader: TextureLoader;
  private static _gltfLoader: GLTFLoader;

  public static init(
    assets: Asset[],
    cache: LoadedAssets,
    options?: InitOptions
  ) {
    this._assets = assets;
    this._cache = cache;

    this._loadingManager = options?.loadingManager;
    this._cubeTextureLoader = new CubeTextureLoader(this._loadingManager);
    this._textureLoader = new TextureLoader(this._loadingManager);
    this._gltfLoader = new GLTFLoader(this._loadingManager);

    if (options?.draco) {
      const dracoLoader = new DRACOLoader();
      this._gltfLoader.setDRACOLoader(dracoLoader);
    }
  }

  /* LOADERS */

  public static async loadCubeTexture(name: string, options?: LoaderOptions) {
    if (this._cache.cubeTexture[name]) {
      return this._cache.cubeTexture[name].file;
    }

    const source = this._assets
      .filter(
        (source): source is CubeTextureResource => source.type === 'cubeTexture'
      )
      .find((source) => source.name === name && source.type === 'cubeTexture');

    if (!source) {
      throw new Error(`Cube texture resource "${name}" not found`);
    }

    const texture = await this._cubeTextureLoader.loadAsync(
      source.path,
      options?.onProgress
    );

    this._cache.cubeTexture[name] = {
      ...source,
      file: texture,
    };

    return texture;
  }

  public static async loadTexture(name: string, options?: LoaderOptions) {
    if (this._cache.texture[name]) {
      return this._cache.texture[name].file;
    }

    const source = this._assets
      .filter((source): source is TextureResource => source.type === 'texture')
      .find((source) => source.name === name && source.type === 'texture');

    if (!source) {
      throw new Error(`Texture "${name}" not found`);
    }

    const texture = await this._textureLoader.loadAsync(
      source.path,
      options?.onProgress
    );
    texture.name = source.name;

    this._cache.texture[name] = {
      ...source,
      file: texture,
    };

    return texture;
  }

  public static async loadAllTextures(options?: LoaderOptions) {
    const texturePromises = this._assets
      .filter((source): source is TextureResource => source.type === 'texture')
      .map((source) => this.loadTexture(source.name, options));

    return Promise.all(texturePromises);
  }

  public static async loadGltfModel(name: string, options?: LoaderOptions) {
    if (this._cache.gltf[name]) {
      return this._cache.gltf[name].file;
    }

    const source = this._assets
      .filter((source): source is GLTFModelResource => source.type === 'gltf')
      .find((source) => source.name === name && source.type === 'gltf');

    if (!source) {
      throw new Error(`GLTF resource "${name}" not found`);
    }

    const gltf = await this._gltfLoader.loadAsync(
      source.path,
      options?.onProgress
    );

    this._cache.gltf[name] = {
      ...source,
      file: gltf,
    };

    return gltf;
  }
}
