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
import { debugStore, Store } from './store';

interface ExperienceOptions {
  canvas?: HTMLCanvasElement;
}

export class Experience {
  public static isInit = false;
  public static isLoaded = false;
  public static namespace = 'Experience';

  public static init(root: HTMLElement, options?: ExperienceOptions) {
    // Assets and resources
    ResourceController.init(sources);

    // DOM interactive interface and render context
    StageController.init(root, {
      canvas: options?.canvas,
    });

    // DOM debug interface
    DebugController.init();
    if (debugStore.enabled) {
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
    Store.subscriptions[this.namespace].forEach((sub) => sub());

    RenderController.destroy();
    CameraController.destroy();
    WorldController.destroy();

    DebugController.destroy();
    TimeController.destroy();
    StageController.destroy();
    ResourceController.destroy();
  };

  /**
   * Handler function to execute after the experience is loaded.
   * @param callback callback function to execute
   */
  public static onLoad(callback: () => void) {
    const worldSub = Store.world.subscribe((state) => {
      if (state.viewsReady) {
        callback();
      }
    });
    Store.subscriptions[this.namespace].push(worldSub);
  }
}
