import {
  ACESFilmicToneMapping,
  Color,
  PCFSoftShadowMap,
  SRGBColorSpace,
} from 'three';

import type { ThreeState } from '@helpers/atoms';
import { WebGLView } from '@helpers/three';

import { Fireflies } from './Fireflies';
import { Loading } from './Loading';
import { Portal } from './Portal';
import { backgroundColorAtom } from './State';

export class PortalScene extends WebGLView {
  private portal: Portal;
  private fireflies: Fireflies;

  constructor(state: ThreeState) {
    super('PortalScene', state);

    this.init(
      this.setupCamera,
      this.setupControls,
      this.setupRenderer,
      this.setupScene,
      this.setupSubscriptions
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
    this._scene.background = new Color(backgroundColorAtom.get());
  };

  /* SETUP SCENE */

  private setupScene = (state: ThreeState) => {
    new Loading(state);
    this.portal = new Portal(state);
    this.fireflies = new Fireflies(state);
  };

  /* SUBSCRIPTIONS */

  private setupSubscriptions = () => {
    backgroundColorAtom.sub(this.updateBackgroundColor, {
      namespace: this.namespace,
    });
  };

  private updateBackgroundColor = (color: string) => {
    this._scene.background = new Color(color);
  };
}
