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

  private setupCamera = ({ camera }: ThreeState) => {
    camera.position.set(7, 7, 7);
    camera.fov = 25;
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
  };

  private setupControls = ({ controls }: ThreeState) => {
    controls.enabled = true;
    controls.enableDamping = true;
    controls.update();
  };

  private setupRenderer = ({ renderer, scene }: ThreeState) => {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = SRGBColorSpace;
    scene.background = new Color(backgroundColorAtom.get());
  };

  /* SETUP SCENE */

  private setupScene = (state: ThreeState) => {
    new Loading(state);
    this.portal = new Portal(state);
    this.fireflies = new Fireflies(state);
  };

  /* SUBSCRIPTIONS */

  private setupSubscriptions = ({ scene }: ThreeState) => {
    backgroundColorAtom.sub((color) => (scene.background = new Color(color)), {
      namespace: this.namespace,
    });
  };
}
