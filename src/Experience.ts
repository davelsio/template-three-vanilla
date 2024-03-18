import { CameraController } from '@controllers/Camera';
import { DebugController } from '@controllers/Debug';
import { RenderController } from '@controllers/Renderer';
import { StageController } from '@controllers/Stage';
import { TimeController } from '@controllers/Time';
import { WorldController } from '@controllers/World';
import {
  CubeTextures,
  DataTextures,
  GLTFModels,
  Textures,
} from '@loaders/assets';
import { ResourceLoader } from '@loaders/ResourceLoader';
import { Store } from '@state/Store';

export class Experience {
  /**
   * The public API for the experience.
   */
  public api = Store;

  private _cameraController: CameraController;
  private _debugController: DebugController;
  private _renderController: RenderController;
  private _stageController: StageController;
  private _timeController: TimeController;
  private _worldController: WorldController;

  public constructor(root: HTMLDivElement, canvas?: HTMLCanvasElement) {
    Store.init();

    // Assets and resources
    ResourceLoader.init(CubeTextures, DataTextures, Textures, GLTFModels, {
      draco: true,
    });

    // DOM interactive interface and render context
    this._stageController = new StageController(root, canvas);

    // DOM debug interface
    this._debugController = new DebugController();
    if (Store.debug.state.enabled) {
      window.experience = this;
    }

    // Frames and clock
    this._timeController = new TimeController();

    // WebGL camera
    this._cameraController = new CameraController(
      this._stageController.aspectRatio,
      this._stageController.canvas
    );

    // WebGL renderer
    this._renderController = new RenderController(
      this._stageController.canvas,
      this._stageController.width,
      this._stageController.height,
      this._cameraController.camera
    );

    // WebGL views
    this._worldController = new WorldController();
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

    Store.destroy();
  };
}
