import {
  AmbientLight,
  CubeTexture,
  PointLight,
  Scene,
  sRGBEncoding,
} from 'three';

import { isThreeMesh, isThreeMeshStandardMaterial } from '../utils/type-guards';

interface Assets {
  environmentMap: CubeTexture;
}

interface Props {
  envMapIntensity: number;
}

export default class Environment {
  private _props: Props = {
    envMapIntensity: 2.5,
  };

  private assets: Assets;
  private scene: Scene;

  private ambientLight: AmbientLight;
  private pointLight: PointLight;

  constructor(scene: Scene, assets: Assets, props?: Partial<Props>) {
    this.scene = scene;
    this.assets = assets;

    this._props = Object.assign(this._props, props);

    // Setup
    this.setupLights();
    // this.setupEnvironmentMap();
  }

  public destroy() {
    /**
     * Do NOT remove or dispose lights, reuse them instead.
     * Every time a light is removed, all objects within its
     * influence will need to be updated.
     */
  }

  /* SETUP */

  private setupEnvironmentMap() {
    this.assets.environmentMap.encoding = sRGBEncoding;
    this.scene.background = this.assets.environmentMap;
    this.scene.environment = this.assets.environmentMap;
    this.updateMaterials();
  }

  private setupLights() {
    this.ambientLight = new AmbientLight(0xffffff, 0.5);

    this.pointLight = new PointLight(0xffffff, 0.5);
    this.pointLight.position.set(2, 3, 4);
    this.scene.add(this.ambientLight);
  }

  private updateMaterials() {
    this.scene.traverse((child) => {
      if (isThreeMesh(child) && isThreeMeshStandardMaterial(child.material)) {
        child.material.envMap = this.assets.environmentMap;
        child.material.envMapIntensity = this._props.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  }

  /* CALLBACKS */

  private debug() {
    //
  }
}
