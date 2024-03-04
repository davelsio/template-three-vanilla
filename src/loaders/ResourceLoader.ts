import { LoadedAssets, SourceAssets } from '@controllers/Resources';
import {
  CubeTextureAssets,
  GLTFModelAssets,
  TextureAssets,
} from '@loaders/assets';
import { TypedObject } from '@utils/typedObject';
import { CubeTextureLoader, LoadingManager, TextureLoader } from 'three';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';

interface LoaderOptions {
  onProgress?: (event: ProgressEvent) => void;
}

interface InitOptions {
  loadingManager: LoadingManager;
  draco?: boolean;
}

export class ResourceLoader {
  private static _assets: SourceAssets;
  private static _cache: LoadedAssets;

  private static _loadingManager?: LoadingManager;
  private static _cubeTextureLoader: CubeTextureLoader;
  private static _textureLoader: TextureLoader;
  private static _gltfLoader: GLTFLoader;

  public static init(
    assets: SourceAssets,
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

  public static async loadCubeTexture(
    name: keyof CubeTextureAssets,
    options?: LoaderOptions
  ) {
    if (this._cache.cubeTexture[name]) {
      return this._cache.cubeTexture[name];
    }

    const source = this._assets.cubeTextures[name];
    if (!source) {
      throw new Error(`Cube texture resource "${name}" not found`);
    }

    const texture = await this._cubeTextureLoader.loadAsync(
      source,
      options?.onProgress
    );

    this._cache.cubeTexture[name] = texture;
    return texture;
  }

  public static async loadTexture(
    name: keyof TextureAssets,
    options?: LoaderOptions
  ) {
    if (this._cache.texture[name]) {
      return this._cache.texture[name];
    }

    const source = this._assets.textures[name];
    if (!source) {
      throw new Error(`Texture "${name}" not found`);
    }

    const texture = await this._textureLoader.loadAsync(
      source,
      options?.onProgress
    );
    texture.name = name as string;

    this._cache.texture[name] = texture;
    return texture;
  }

  public static async loadAllTextures(options?: LoaderOptions) {
    const texturePromises = TypedObject.keys(this._assets.textures).map(
      (name) => this.loadTexture(name, options)
    );

    return Promise.all(texturePromises);
  }

  public static async loadGltfModel(
    name: keyof GLTFModelAssets,
    options?: LoaderOptions
  ) {
    if (this._cache.gltf[name]) {
      return this._cache.gltf[name];
    }

    const source = this._assets.gltfs[name];
    if (!source) {
      throw new Error(`GLTF resource "${name}" not found`);
    }

    const gltf = await this._gltfLoader.loadAsync(source, options?.onProgress);

    this._cache.gltf[name] = gltf;
    return gltf;
  }
}
