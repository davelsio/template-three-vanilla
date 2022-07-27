import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';

import { stageStore, subscriptions, timeStore } from '../store';

interface CameraOptions {
  target: Vector3;
}

export class CameraController {
  public static camera: PerspectiveCamera;
  public static controls: OrbitControls;
  public static namespace = 'CameraController';

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
    this.controls.enabled = false;

    this.setupSubscriptions();
  }

  public static destroy() {
    subscriptions[this.namespace].forEach((unsub) => unsub());
    this.controls.dispose();
  }

  /* SETUP */

  private static setupSubscriptions() {
    subscriptions[this.namespace].push(
      timeStore.subscribe((state) => state.elapsed, this.update),
      stageStore.subscribe((state) => state.aspectRatio, this.resize)
    );
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
