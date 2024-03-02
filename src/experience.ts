import { CameraController } from '@controllers/camera';
import { DebugController } from '@controllers/debug';
import { RenderController } from '@controllers/renderer';
import { ResourceController } from '@controllers/resources';
import { StageController } from '@controllers/stage';
import { TimeController } from '@controllers/time';
import { WorldController } from '@controllers/world';
import sources from '@loaders/sources';
import { Store } from '@state/store';

export class Experience {
  private _cameraController: CameraController;
  private _debugController: DebugController;
  private _renderController: RenderController;
  private _resourceController: ResourceController;
  private _stageController: StageController;
  private _timeController: TimeController;
  private _worldController: WorldController;

  public get api() {
    return {
      camera: this._cameraController.camera,
      controls: this._cameraController.controls,
    };
  }

  public namespace = 'Experience';

  public constructor(root: HTMLDivElement, canvas?: HTMLCanvasElement) {
    Store.init();

    // Assets and resources
    this._resourceController = new ResourceController(sources);

    // DOM interactive interface and render context
    this._stageController = new StageController(root, canvas);

    // DOM debug interface
    this._debugController = new DebugController();
    if (Store.debug.state.enabled) {
      window.experience = this;
    }

    // Frames and clock
    this._timeController = new TimeController();

    // WebGL scene and views
    this._worldController = new WorldController();

    // WebGL camera
    this._cameraController = new CameraController(
      this._stageController.aspectRatio,
      this._stageController.canvas,
      {
        target: this._worldController.scene.position,
      }
    );

    // WebGL renderer
    this._renderController = new RenderController(
      this._stageController.canvas,
      this._stageController.width,
      this._stageController.height,
      this._cameraController.camera,
      this._worldController.scene
    );
  }

  /**
   * Destroy all dependencies.
   */
  public destroy = () => {
    this._renderController.destroy();
    this._cameraController.destroy();
    this._worldController.destroy();

    this._debugController.destroy();
    this._timeController.destroy();
    this._stageController.destroy();
    this._resourceController.destroy();

    Store.destroy();
  };

  /**
   * Handler function to execute after the experience is loaded.
   * @param callback callback function to execute
   */
  public onLoad(callback: () => void) {
    Store.world.subscribe(
      this.namespace,
      (state) => state.loadingReady,
      (loadingReady) => loadingReady && callback()
    );
  }
}
