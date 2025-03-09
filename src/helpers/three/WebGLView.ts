import type { Atom } from 'jotai';
import { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import type { ThreeState } from '../atoms';

type SetupCallback = () => void | Promise<void>;
type WebGLViewOptions<T> = T & {
  isLoaded: boolean;
};

export type SubToAtomArgs<T, R> = [
  /**
   * Atom to subscribe.
   */
  atom: Atom<T>,
  /**
   * Function to execute when the atom state changes.
   */
  callback: (value: T) => R,
  /**
   * Subscription options.
   */
  options?: {
    /**
     * Execute the callback when the atom mounts.
     */
    callImmediately?: boolean;
    /**
     * Execute thec callback only once and unsubscribe.

     * If a function is provided, it will be called with the result of the
     * callback as an argument. The callback will only be executed once the
     * result of this function is `true`.
     */
    once?: boolean | ((res: R) => boolean | void);
  },
];

export abstract class WebGLView<T extends object = object> extends Group {
  public namespace: string;
  public props: WebGLViewOptions<T>;

  protected _state: ThreeState;

  protected _camera: PerspectiveCamera;
  protected _controls: OrbitControls;
  protected _renderer: WebGLRenderer;
  protected _scene: Scene;

  protected _viewport: ThreeState['viewport'];
  protected _views: ThreeState['views'];

  private _destroy: SetupCallback[];

  protected constructor(
    namespace: string,
    state: ThreeState,
    props: WebGLViewOptions<T> = {} as WebGLViewOptions<T>
  ) {
    super();
    this.namespace = namespace;
    this.props = Object.assign({ isLoaded: false }, props);

    this._state = state;

    const { renderer, scene } = state.three;
    const { camera, controls } = state.camera;

    this._camera = camera;
    this._controls = controls;
    this._renderer = renderer;
    this._scene = scene;

    this._viewport = state.viewport;
    this._views = state.views;

    state.three.mount();
  }

  /**
   * Initialize the view.
   * @param setup array of setup functions
   */
  public async init(...setup: Array<SetupCallback>) {
    this._views.add(this);
    this._scene.add(this);

    for (const callback of setup) {
      await callback();
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
      await callback();
    }
  }
}
