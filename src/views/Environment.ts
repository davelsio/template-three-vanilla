import { AmbientLight, CubeTexture, PointLight, SRGBColorSpace } from 'three';

import { WebGLView } from '@helpers/classes/WebGLView';
import { isThreeMeshStandardMaterial } from '@helpers/guards/isThreeMaterial';
import { isThreeMesh } from '@helpers/guards/isThreeMesh';

interface Props {
  envMapIntensity: number;
}

export class Environment extends WebGLView<Props> {
  private _environmentMap: CubeTexture;
  private _ambientLight: AmbientLight;
  private _pointLight: PointLight;

  constructor() {
    super('EnvironmentView', {
      envMapIntensity: 2.5,
    });
    void this.init(this.setupEnvironmentMap, this.setupLights);
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
    // this._environmentMap = await ResourceLoader.loadCubeTexture();
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
}
