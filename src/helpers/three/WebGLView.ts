import { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import type { ThreeState } from '../atoms';

type SetupCallback = (state: ThreeState) => void | Promise<void>;
type WebGLViewOptions<T> = T & {
  isLoaded: boolean;
};

export abstract class WebGLView<T extends object = object> extends Group {
  public namespace: string;
  public props: WebGLViewOptions<T>;

  private _state: ThreeState;
  private _destroy: SetupCallback[];

  private _camera: PerspectiveCamera;
  private _controls: OrbitControls;
  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _viewport: ThreeState['viewport'];
  private _views: ThreeState['views'];

  protected constructor(
    namespace: string,
    state: ThreeState,
    props: WebGLViewOptions<T> = {} as WebGLViewOptions<T>
  ) {
    super();
    this.namespace = namespace;
    this.props = Object.assign({ isLoaded: false }, props);

    this._state = state;

    const { camera, controls, renderer, scene, viewport, views } = state;

    this._camera = camera;
    this._controls = controls;
    this._renderer = renderer;
    this._scene = scene;
    this._viewport = viewport;
    this._views = views;

    state.mount();
  }

  /**
   * Initialize the view.
   * @param setup array of setup functions
   */
  public async init(...setup: Array<SetupCallback>) {
    this._views.add(this);
    this._scene.add(this);

    for (const callback of setup) {
      await callback(this._state);
    }

    if (!this.props.isLoaded) {
      this.props.isLoaded = true;
      this._views.setLoaded(this.namespace);
    }
  }

  /**
   * Clean up the view and remove it from the scene.
   */
  public async dispose(...dispose: SetupCallback[]) {
    if (dispose.length > 0) {
      this._destroy = dispose;
      return;
    }

    this._scene.remove(this);
    this._views.remove(this.namespace);
    this._state.unsub(this.namespace);
    for (const callback of this._destroy) {
      await callback(this._state);
    }
  }
}
