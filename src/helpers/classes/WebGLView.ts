import { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import { TimeAtom } from '@atoms/atomWithTime';
import { ViewportAtom } from '@atoms/atomWithViewport';
import { threeAtom, timeAtom, vpAtom } from '@state/rendering';
import { viewsLoadedAtom, viewsToLoadAtom } from '@state/rendering/world';
import { appStore, subToAtom, SubToAtomArgs, unSubAll } from '@state/store';

type SetupCallback = () => void | Promise<void>;
type WebGLViewOptions<T> = T & {
  needsLoadingScreen?: boolean;
};

export abstract class WebGLView<T extends {} = {}> extends Group {
  public namespace: string;
  public props: WebGLViewOptions<T>;

  protected _camera: PerspectiveCamera;
  protected _controls: OrbitControls;
  protected _renderer: WebGLRenderer;
  protected _scene: Scene;

  protected _vpAtom: ViewportAtom;
  protected _timeAtom: TimeAtom;

  private _destroy: SetupCallback[];

  protected constructor(
    namespace: string,
    props: WebGLViewOptions<T> = {} as WebGLViewOptions<T>
  ) {
    super();
    this.namespace = namespace;
    this.props = Object.assign({ needsLoadingScreen: true }, props);

    this._vpAtom = vpAtom;
    this._timeAtom = timeAtom;

    const { camera, controls, renderer, scene } = appStore.get(threeAtom);
    this._camera = camera;
    this._controls = controls;
    this._renderer = renderer;
    this._scene = scene;
    appStore.sub(threeAtom, () => {});
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

    this.props.needsLoadingScreen
      ? void this.withLoader(initialize)
      : void initialize();
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
      unSubAll(this.namespace);
      const isLoaded = appStore.get(viewsLoadedAtom).includes(this.namespace);
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
    this.props.needsLoadingScreen
      ? this.subToAtom(viewsLoadedAtom, (viewsLoaded) => {
          const isLoaded = viewsLoaded.includes(this.namespace);
          if (isLoaded) {
            disposeView();
            appStore.set(viewsToLoadAtom, removeView);
            appStore.set(viewsLoadedAtom, removeView);
          }
        })
      : await disposeView();
  }

  /**
   * Notify the store that this view has been loaded.
   */
  protected flagAsLoaded() {
    appStore.set(viewsLoadedAtom, (prev) => [...prev, this.namespace]);
  }

  /**
   * Notify the store that this view is loading.
   */
  protected flagAsLoading() {
    appStore.set(viewsToLoadAtom, (prev) => [...prev, this.namespace]);
  }

  protected subToAtom<T, R>(...args: SubToAtomArgs<T, R>) {
    return subToAtom(this.namespace, ...args);
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
