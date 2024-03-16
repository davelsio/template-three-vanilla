import { Camera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import { StateNotInitializedError } from '@errors/StateNotInitializedError';
import { StoreInstance } from '@helpers/classes/StoreInstance';

type ApiState = {
  _camera?: Camera;
  _controls?: OrbitControls;
  _renderer?: WebGLRenderer;
  _scene?: Scene;
};

export class ApiStore extends StoreInstance<ApiState> {
  public get camera() {
    if (!this.state._camera) throw new StateNotInitializedError('camera');
    return this.state._camera;
  }

  public get controls() {
    if (!this.state._controls) throw new StateNotInitializedError('controls');
    return this.state._controls;
  }

  public get renderer() {
    if (!this.state._renderer) throw new StateNotInitializedError('renderer');
    return this.state._renderer;
  }

  public get scene() {
    if (!this.state._scene) throw new StateNotInitializedError('scene');
    return this.state._scene;
  }

  constructor() {
    super({});
  }
}
