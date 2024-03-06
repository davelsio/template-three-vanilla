import { BaseController } from '@helpers/BaseController';
import { Store } from '@state/Store';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

export class CameraController extends BaseController {
  public camera: PerspectiveCamera;
  public controls: OrbitControls;

  public constructor(aspectRatio: number, canvas: HTMLElement) {
    super('CameraController');

    // Config
    const fov = Store.debug.state.cameraFov;
    const near = Store.debug.state.cameraNear;
    const far = Store.debug.state.cameraFar;
    const position = Store.debug.state.cameraPosition;

    // Camera
    this.camera = new PerspectiveCamera(fov, aspectRatio, near, far);
    this.camera.position.set(position.x, position.y, position.z);

    // Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enabled = true;

    this.setupSubscriptions();
  }

  public destroy() {
    Store.unsubscribe(this.namespace);
    this.controls.dispose();
  }

  /* SETUP */

  private setupSubscriptions() {
    Store.stage.subscribe(
      this.namespace,
      (state) => state.aspectRatio,
      this.resize
    );
    Store.time.subscribe(this.namespace, (state) => state.elapsed, this.update);
  }

  /* CALLBACKS */

  private resize = (aspectRatio: number) => {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  };

  private update = () => {
    this.controls.enabled && this.controls.update();
  };
}
