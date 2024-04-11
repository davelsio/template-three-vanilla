import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three';

import { WebGLView } from '@helpers/classes/WebGLView';

import { Fireflies } from './Fireflies';
import { Loading } from './Loading';
import { Portal } from './Portal';

export class PortalScene extends WebGLView {
  private portal: Portal;
  private fireflies: Fireflies;

  constructor() {
    super('PortalScene');

    this.init(
      this.setupCamera,
      this.setupControls,
      this.setupRenderer,
      this.setupScene
    );

    void this.dispose(() => {
      void this.portal.dispose();
      void this.fireflies.dispose();
    });
  }

  /* SETUP RENDERING */

  private setupCamera = () => {
    this._camera.position.set(7, 7, 7);
    this._camera.fov = 25;
    this._camera.near = 0.1;
    this._camera.far = 100;
    this._camera.updateProjectionMatrix();
  };

  private setupControls = () => {
    this._controls.enabled = true;
    this._controls.enableDamping = true;
    this._controls.update();
  };

  private setupRenderer = () => {
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
    this._renderer.toneMapping = ACESFilmicToneMapping;
    this._renderer.toneMappingExposure = 1;
    this._renderer.outputColorSpace = SRGBColorSpace;
  };

  /* SETUP SCENE */

  private setupScene = () => {
    new Loading();
    this.portal = new Portal();
    this.fireflies = new Fireflies();
  };
}
