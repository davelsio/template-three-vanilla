import {
  ACESFilmicToneMapping,
  Color,
  PCFSoftShadowMap,
  SRGBColorSpace,
} from 'three';

import { type State, WebGLView } from '@helpers/three';

import { Fireflies } from './Fireflies';
import { Loading } from './Loading';
import { Portal } from './Portal';
import { backgroundColorAtom } from './PortalState';

export class PortalScene extends WebGLView {
  private portal: Portal;
  private fireflies: Fireflies;

  constructor(state: State) {
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
    this._scene.background = new Color(
      this._state.store.get(backgroundColorAtom)
    );
  };

  /* SETUP SCENE */

  private setupScene = () => {
    new Loading(this._state);
    this.portal = new Portal(this._state);
    this.fireflies = new Fireflies(this._state);
  };

  /* SUBSCRIPTIONS */

  private setupSubscriptions = () => {
    this.subToAtom(backgroundColorAtom, this.updateBackgroundColor);
  };

  private updateBackgroundColor = (color: string) => {
    this._scene.background = new Color(color);
  };
}
