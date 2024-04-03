import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

import { BaseController } from '@helpers/classes/BaseController';
import { Store } from '@state/Store';

export class CameraController extends BaseController {
  public camera: PerspectiveCamera;
  public controls: OrbitControls;

  public constructor(aspectRatio: number, canvas: HTMLElement) {
    super('CameraController');

    // Config
    const fov = Store.camera.state.cameraFov;
    const near = Store.camera.state.cameraNear;
    const far = Store.camera.state.cameraFar;
    const position = Store.camera.state.cameraPosition;

    // Camera
    this.camera = new PerspectiveCamera(fov, aspectRatio, near, far);
    this.camera.position.set(position.x, position.y, position.z);

    // Controls
    const controls = Store.camera.state.controlsEnabled;
    const damping = Store.camera.state.controlsDamping;
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enabled = controls;
    this.controls.enableDamping = damping;

    const { api } = Store.getUpdaters();
    api({ _camera: this.camera, _controls: this.controls });
    this.setupSubscriptions();
  }

  public destroy() {
    Store.unsubscribe(this.namespace);
    this.controls.dispose();
  }

  public getViewSizeAtDepth(depth = 0) {
    const camera = Store.api.camera;
    const fovInRadians = (camera.fov * Math.PI) / 180;
    const height = Math.abs(
      (camera.position.z - depth) * Math.tan(fovInRadians / 2) * 2
    );
    return { width: height * camera.aspect, height };
  }

  /* SETUP */

  private setupSubscriptions() {
    const { stage, time } = Store.getSubscribers(this.namespace);
    stage((state) => state.aspectRatio, this.resize);
    time((state) => state.elapsed, this.updateControls);
  }

  /* CALLBACKS */

  private resize = (aspectRatio: number) => {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  };

  private updateControls = () => {
    this.controls.enabled && this.controls.update();
  };
}
