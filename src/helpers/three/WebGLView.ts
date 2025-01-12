import { atom, ExtractAtomValue } from 'jotai/index';
import { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import type { TimeAtom, ViewportAtom } from '../atoms';
import type { State, SubToAtomArgs } from './createThreeState';

type SetupCallback = () => void | Promise<void>;
type WebGLViewOptions<T> = T & {
  needsLoadingScreen?: boolean;
};

const viewsToLoadAtom = atom<string[]>([]);
const viewsLoadedAtom = atom<string[]>([]);

export type ViewsProgressAtom = typeof viewsProgressAtom;
export type ViewsProgressAtomValue = ExtractAtomValue<ViewsProgressAtom>;
export const viewsProgressAtom = atom((get) => {
  const viewsToLoad = get(viewsToLoadAtom);
  const viewsLoaded = get(viewsLoadedAtom);
  return viewsToLoad ? viewsLoaded.length / viewsToLoad.length : 0;
});

export abstract class WebGLView<T extends object = object> extends Group {
  public namespace: string;
  public props: WebGLViewOptions<T>;

  protected _state: State;

  protected _camera: PerspectiveCamera;
  protected _controls: OrbitControls;
  protected _renderer: WebGLRenderer;
  protected _scene: Scene;

  protected _vpAtom: ViewportAtom;
  protected _timeAtom: TimeAtom;

  private _destroy: SetupCallback[];

  protected constructor(
    namespace: string,
    state: State,
    props: WebGLViewOptions<T> = {} as WebGLViewOptions<T>
  ) {
    super();
    this.namespace = namespace;
    this.props = Object.assign({ needsLoadingScreen: true }, props);

    this._vpAtom = state.vpAtom;
    this._timeAtom = state.timeAtom;

    const { camera, controls, renderer, scene } = state.three;
    this._camera = camera;
    this._controls = controls;
    this._renderer = renderer;
    this._scene = scene;
    this._state = state;

    state.store.sub(state.threeAtom, () => {});
  }

  /**
   * Initialize the view.
   * @param setup list of setup functions
   */
  public init(...setup: Array<SetupCallback>) {
    const initialize = async () => {
      for (const callback of setup) {
        await callback();
      }
      this._scene.add(this);
    };

    if (this.props.needsLoadingScreen) {
      void this.withLoader(initialize);
    } else {
      void initialize();
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

    /**
     * Dispose the view and remove it from the scene.
     */
    const disposeView = async () => {
      this._scene.remove(this);
      this._state.unSubAll(this.namespace);
      const isLoaded = this._state.store
        .get(viewsLoadedAtom)
        .includes(this.namespace);
      if (isLoaded) {
        for (const callback of this._destroy) {
          await callback();
        }
      }
    };

    /**
     * Remove the view from the list of views to load and loaded.
     * @param names previous state
     */
    const removeView = (names: string[]) =>
      names.filter((v) => v !== this.namespace);

    /**
     * Remove the view once it is loaded.
     */
    if (this.props.needsLoadingScreen) {
      this.subToAtom(viewsLoadedAtom, (viewsLoaded) => {
        const isLoaded = viewsLoaded.includes(this.namespace);
        if (isLoaded) {
          disposeView();
          this._state.store.set(viewsToLoadAtom, removeView);
          this._state.store.set(viewsLoadedAtom, removeView);
        }
      });
    } else {
      await disposeView();
    }
  }

  /**
   * Notify the store that this view has been loaded.
   */
  protected flagAsLoaded() {
    this._state.store.set(viewsLoadedAtom, (prev) => [...prev, this.namespace]);
  }

  /**
   * Notify the store that this view is loading.
   */
  protected flagAsLoading() {
    this._state.store.set(viewsToLoadAtom, (prev) => [...prev, this.namespace]);
  }

  /**
   * Subscribe to an internal state atom.
   * @param args subscription parameters
   */
  protected subToAtom<T, R>(...args: SubToAtomArgs<T, R>) {
    return this._state.subToAtom(this.namespace, ...args);
  }

  /**
   * Run a setup function with a loading state.
   * @param cb setup function
   */
  protected async withLoader(cb: SetupCallback) {
    this.flagAsLoading();
    await cb();
    this.flagAsLoaded();
  }
}
