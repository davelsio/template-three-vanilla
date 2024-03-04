/**
 * Cube textures. For example, environment maps.
 * Type: Record<string, string[]>
 */
export const CubeTextures = {};

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
export type GLTFModelAssets = typeof GLTFModels;
export type TextureAssets = typeof Textures;
