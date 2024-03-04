import { WebGLView } from '@helpers/WebGLView';
import { ResourceLoader } from '@loaders/ResourceLoader';
import {
  AmbientLight,
  CubeTexture,
  PointLight,
  Scene,
  SRGBColorSpace,
} from 'three';

import { isThreeMeshStandardMaterial } from '../type-guards/isThreeMaterial';
import { isThreeMesh } from '../type-guards/isThreeMesh';

interface Props {
  envMapIntensity: number;
}

export class Environment extends WebGLView<Props> {
  private _environmentMap: CubeTexture;
  private _ambientLight: AmbientLight;
  private _pointLight: PointLight;

  constructor(scene: Scene, props?: Partial<Props>) {
    super(scene, {
      envMapIntensity: 2.5,
      ...props,
    });
    this._scene = scene;
    super.flagAsLoading();
    this.init();
  }

  public async init() {
    await this.setupEnvironmentMap();
    this.setupLights();
    super.flagAsLoaded();
  }

  public destroy() {
    /**
     * Do NOT remove or dispose lights, reuse them instead.
     * Every time a light is removed, all objects within its
     * influence will need to be updated.
     */
  }

  /* SETUP */

  private async setupEnvironmentMap() {
    this._environmentMap = await ResourceLoader.loadCubeTexture(
      'environmentMapTexture'
    );
    this._environmentMap.colorSpace = SRGBColorSpace;
    this._scene.background = this._environmentMap;
    this._scene.environment = this._environmentMap;

    // Update materials
    this._scene.traverse((child) => {
      if (isThreeMesh(child) && isThreeMeshStandardMaterial(child.material)) {
        child.material.envMap = this._environmentMap;
        child.material.envMapIntensity = this._props.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  }

  private setupLights() {
    this._ambientLight = new AmbientLight(0xffffff, 0.5);
    this._pointLight = new PointLight(0xffffff, 0.5);
    this._pointLight.position.set(2, 3, 4);
    this._scene.add(this._ambientLight);
  }

  /* CALLBACKS */

  private debug() {
    //
  }
}
