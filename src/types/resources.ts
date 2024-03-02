import { CubeTexture, Texture } from 'three';
import { GLTF } from 'three-stdlib';

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

export type Assets = Array<
  CubeTextureResource | TextureResource | GLTFModelResource
>;

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
