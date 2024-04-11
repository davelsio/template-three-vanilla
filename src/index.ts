import {
  CubeTextures,
  DataTextures,
  GLTFModels,
  Textures,
} from '@loaders/assets';
import { ResourceLoader } from '@loaders/ResourceLoader';

import { PortalScene } from './scene/PortalScene';

import '@styles/reset.css';
import '@styles/webgl.css';
import '@styles/tweakpane.css';

ResourceLoader.init(CubeTextures, DataTextures, Textures, GLTFModels, {
  draco: true,
});

new PortalScene();
