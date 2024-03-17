import { AmbientLight, CubeTexture, PointLight, SRGBColorSpace } from 'three';

import { WebGLView } from '@helpers/classes/WebGLView';
import { isThreeMeshStandardMaterial } from '@helpers/guards/isThreeMaterial';
import { isThreeMesh } from '@helpers/guards/isThreeMesh';

interface Props {
  envMapIntensity: number;
}

export class Environment extends WebGLView<Props> {
  private environmentMap: CubeTexture;
  private ambientLight: AmbientLight;
  private pointLight: PointLight;

  constructor() {
    super('EnvironmentView', {
      envMapIntensity: 2.5,
    });
    void this.init(
      this.setupAssets,
      this.setupEnvironmentMap,
      this.setupLights
    );
  }

  public destroy() {
    /**
     * If possible, try to reuse lights instead of removing or disposing them.
     * Every time a light is removed, all objects within its influence will need
     * to be updated.
     */
    this.ambientLight.dispose();
    this.pointLight.dispose();
    this._scene.remove(this);
  }

  /* SETUP */

  private setupAssets = async () => {
    // this.environmentMap = await ResourceLoader.loadCubeTexture();
    this.environmentMap.colorSpace = SRGBColorSpace;
  };

  private setupEnvironmentMap = () => {
    this._scene.background = this.environmentMap;
    this._scene.environment = this.environmentMap;

    // Update materials
    this._scene.traverse((child) => {
      if (isThreeMesh(child) && isThreeMeshStandardMaterial(child.material)) {
        child.material.envMap = this.environmentMap;
        child.material.envMapIntensity = this._props.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  };

  private setupLights() {
    this.ambientLight = new AmbientLight(0xffffff, 0.5);
    this.pointLight = new PointLight(0xffffff, 0.5);
    this.pointLight.position.set(2, 3, 4);
    this.add(this.ambientLight);
  }
}
