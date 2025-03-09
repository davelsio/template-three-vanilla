import { type Atom, atom, type ExtractAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import { Store } from '@helpers/jotai';

import type { TimeAtom, ViewportAtom } from '../atoms';
import type { ThreeState } from '../atoms';

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

const _subsFamily = atomFamily((_namespace: string) =>
  atom<(() => void)[]>([])
);

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
  protected _store: Store;

  protected _camera: PerspectiveCamera;
  protected _controls: OrbitControls;
  protected _renderer: WebGLRenderer;
  protected _scene: Scene;

  protected _vpAtom: ViewportAtom;
  protected _timeAtom: TimeAtom;

  private _destroy: SetupCallback[];

  protected constructor(
    namespace: string,
    state: ThreeState,
    store: Store,
    props: WebGLViewOptions<T> = {} as WebGLViewOptions<T>
  ) {
    super();
    this.namespace = namespace;
    this.props = Object.assign({ needsLoadingScreen: true }, props);

    this._state = state;
    this._store = store;

    this._vpAtom = state.viewport._atom;
    this._timeAtom = state.time._atom;

    const { renderer, scene } = state.three;
    const { camera, controls } = state.camera;

    this._camera = camera;
    this._controls = controls;
    this._renderer = renderer;
    this._scene = scene;

    this._store.sub(state.three._atom, () => {});
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
      this.unSubAll();
      const isLoaded = this._store
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
          this._store.set(viewsToLoadAtom, removeView);
          this._store.set(viewsLoadedAtom, removeView);
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
    this._store.set(viewsLoadedAtom, (prev) => [...prev, this.namespace]);
  }

  /**
   * Notify the store that this view is loading.
   */
  protected flagAsLoading() {
    this._store.set(viewsToLoadAtom, (prev) => [...prev, this.namespace]);
  }

  /**
   * Subscribe to an internal state atom.
   * @param args subscription parameters
   */
  protected subToAtom<T, R>(...args: SubToAtomArgs<T, R>) {
    const [atom, callback, options] = args;

    const once =
      typeof options?.once === 'function' ? options.once : () => options?.once;

    const listener = () => {
      const res = callback(this._store.get(atom));
      if (once(res)) {
        unsub();
      }
    };
    const unsub = this._store.sub(atom, listener);

    const subsAtom = _subsFamily(this.namespace);
    this._store.set(subsAtom, (prev) => [...prev, unsub]);

    if (options?.callImmediately) {
      listener();
    }

    return () => {
      this._store.set(subsAtom, (prev) => prev.filter((sub) => sub !== unsub));
      unsub();
    };
  }

  /**
   * Unsubscribe from all atoms in the namespace.
   */
  protected unSubAll() {
    const subsAtom = _subsFamily(this.namespace);
    this._store.get(subsAtom).forEach((unsub) => unsub());
    _subsFamily.remove(this.namespace);
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
