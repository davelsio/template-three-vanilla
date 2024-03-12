import { Camera } from 'three';
import { OrbitControls } from 'three-stdlib';

import { StoreInstance } from '@helpers/StoreInstance';
import { CameraSettings, cameraSettings } from '@settings/camera';

interface CameraState extends CameraSettings {
  /**
   * The camera instance.
   */
  camera?: Camera;
  /**
   * The camera controls instance.
   */
  controls?: OrbitControls;
}

export class CameraStore extends StoreInstance<CameraState> {
  public get camera() {
    if (!this.state.camera) {
      throw new Error('Camera not initialized');
    }
    return this.state.camera;
  }

  public get controls() {
    if (!this.state.controls) {
      throw new Error('Camera controls not initialized');
    }
    return this.state.controls;
  }

  constructor() {
    super({
      ...cameraSettings,
    });
  }
}
