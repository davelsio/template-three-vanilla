import { Subscription } from 'rxjs';

import {
  CameraController,
  DebugController,
  RenderController,
  ResourceController,
  StageController,
  TimeController,
  WorldController,
} from './controllers';
import sources from './sources';

interface ExperienceOptions {
  canvas?: HTMLCanvasElement;
}

export class Experience {
  private static subscriptions: Subscription[] = [];

  public static isInit = false;
  public static isLoaded = false;

  public static init(root: HTMLElement, options?: ExperienceOptions) {
    // Assets and resources
    ResourceController.init(sources);

    // DOM interactive interface and render context
    StageController.init(root, {
      canvas: options?.canvas,
    });

    // DOM debug interface
    DebugController.init();
    if (DebugController.state.active) {
      window.experience = this;
    }

    // Frames and clock
    TimeController.init();

    // WebGL scene and views
    WorldController.init();

    // WebGL camera
    CameraController.init(
      StageController.state.aspectRatio,
      StageController.canvas,
      { target: WorldController.scene.position }
    );

    // WebGL renderer
    RenderController.init(
      StageController.canvas,
      StageController.state.width,
      StageController.state.height,
      CameraController.camera,
      WorldController.scene
    );

    this.isInit = true;
    this.onLoad(() => (this.isLoaded = true));
  }

  /**
   * Destroy all dependencies.
   */
  public static destroy = () => {
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    RenderController.destroy();
    CameraController.destroy();
    WorldController.destroy();

    TimeController.destroy();
    StageController.destroy();
    ResourceController.destroy();
  };

  /**
   * Handler function to execute after the experience is loaded.
   * @param callback callback function to execute
   */
  public static onLoad(callback: () => void) {
    const worldSub = WorldController.state.subscribe((state) => {
      if (state.viewsProgress === 1) {
        callback();
      }
    });
    this.subscriptions.push(worldSub);
  }
}
