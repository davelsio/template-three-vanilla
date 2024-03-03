import {
  CubeTextureResource,
  GLTFModelResource,
  TextureResource,
} from '@loaders/resources';

export type Asset = CubeTextureResource | TextureResource | GLTFModelResource;

export const assets: Asset[] = [
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
