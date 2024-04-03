import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import { StateNotInitializedError } from '@errors/StateNotInitializedError';
import { StoreInstance } from '@helpers/classes/StoreInstance';

type ApiState = {
  /**
   * Main Three.js camera used.
   */
  _camera?: PerspectiveCamera;
  /**
   * WebGL canvas where the experience is rendered.
   */
  _canvas?: HTMLCanvasElement;
  /**
   * OrbitControls instance used to control the camera.
   */
  _controls?: OrbitControls;
  /**
   * WebGL renderer used to render the experience.
   */
  _renderer?: WebGLRenderer;
  /**
   * Parent DOM element of the WebGL canvas.
   */
  _root?: HTMLDivElement;
  /**
   * WebGL scene in which the experience is rendered.
   */
  _scene?: Scene;
};

export class ApiStore extends StoreInstance<ApiState> {
  public get camera() {
    if (!this.state._camera) throw new StateNotInitializedError('camera');
    return this.state._camera;
  }

  public get canvas() {
    if (!this.state._canvas) {
      throw new Error('WebGL canvas not found.');
    }
    return this.state._canvas;
  }

  public get controls() {
    if (!this.state._controls) throw new StateNotInitializedError('controls');
    return this.state._controls;
  }

  public get renderer() {
    if (!this.state._renderer) throw new StateNotInitializedError('renderer');
    return this.state._renderer;
  }

  public get root() {
    if (!this.state._root) {
      throw new Error('WebGL root element not found.');
    }
    return this.state._root;
  }

  public get scene() {
    if (!this.state._scene) throw new StateNotInitializedError('scene');
    return this.state._scene;
  }

  constructor() {
    super('ApiStore', {});
  }
}
