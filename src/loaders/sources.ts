import {
  CubeTextureResource,
  GLTFModelResource,
  TextureResource,
} from '@loaders/resources';

export type Asset = CubeTextureResource | TextureResource | GLTFModelResource;

export const portalAssets: Asset[] = [
  {
    name: 'portalBakedTexture',
    type: 'texture',
    path: 'baked.jpg',
  },
  {
    name: 'portalModel',
    type: 'gltf',
    path: 'portal.glb',
  },
];

const sources: Asset[] = [...portalAssets];

export default sources;
