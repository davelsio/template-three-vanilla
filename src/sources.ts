import { Assets } from './types/resources';

export const portalAssets: Assets = [
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

const sources: Assets = [...portalAssets];

export default sources;
