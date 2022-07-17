import { Subscription } from 'rxjs';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';

import { Store } from '../store';

interface CameraOptions {
  target: Vector3;
}

export class CameraController {
  private static _subscriptions: Subscription[] = [];

  public static camera: PerspectiveCamera;
  public static controls: OrbitControls;

  public static init(
    aspectRatio: number,
    canvas: HTMLElement,
    options?: CameraOptions
  ) {
    // Camera
    this.camera = new PerspectiveCamera(40, aspectRatio, 0.5, 40);
    this.camera.position.set(3, 3, 5);

    if (options?.target) {
      this.camera.lookAt(options.target);
    }

    // Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enabled = true;

    this.setupSubscriptions();
  }

  public static destroy() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.controls.dispose();
  }

  /* SETUP */

  private static setupSubscriptions() {
    const frameSub = Store.time.frame.subscribe(() => {
      this.update();
    });
    this._subscriptions.push(frameSub);

    const resizeSub = Store.stage.subscribe((state) => {
      this.resize(state.aspectRatio);
    });
    this._subscriptions.push(resizeSub);
  }

  /* CALLBACKS */

  private static resize = (aspectRatio: number) => {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  };

  private static update = () => {
    this.controls.enabled && this.controls.update();
  };
}
