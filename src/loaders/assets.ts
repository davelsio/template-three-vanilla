/**
 * Cube textures. For example, environment maps.
 * Type: Record<string, string[]>
 */
export const CubeTextures = {};

/**
 * RGBE textures. Also used for environment maps.
 * Type: Record<string, string>
 */
export const DataTextures = {};

/**
 * GLTF models.
 * Type: Record<string, string>
 */
export const GLTFModels = {
  portalModel: 'portal.glb',
};

/**
 * Textures.
 * Type: Record<string, string>
 */
export const Textures = {
  portalBakedTexture: 'baked.jpg',
};

export type CubeTextureAssets = typeof CubeTextures;
export type DataTextureAssets = typeof DataTextures;
export type GLTFModelAssets = typeof GLTFModels;
export type TextureAssets = typeof Textures;

export enum AssetType {
  CubeTexture = 'cubeTexture',
  DataTexture = 'dataTexture',
  GLTF = 'gltf',
  Texture = 'texture',
}
