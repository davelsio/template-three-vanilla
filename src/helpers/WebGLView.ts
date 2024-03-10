import { Group, Scene } from 'three';

import { Store } from '@state/Store';

type SetupCallback = () => void | Promise<void>;
type WebGLViewOptions<T> = T & {
  withLoading?: boolean;
};

export abstract class WebGLView<T extends {} = {}> extends Group {
  public namespace: string;
  protected _props: WebGLViewOptions<T>;
  protected _scene: Scene;

  protected constructor(
    namespace: string,
    scene: Scene,
    props: WebGLViewOptions<T> = {} as WebGLViewOptions<T>
  ) {
    super();
    this.namespace = namespace;
    this._props = Object.assign({ withLoading: true }, props);
    this._scene = scene;
    this._scene.add(this);
  }

  /**
   * Initialize the view.
   * @param setup list of setup functions
   */
  public async init(...setup: Array<SetupCallback>) {
    const initialize = async () => {
      for (const callback of setup) {
        await callback();
      }
    };
    this._props.withLoading
      ? await this.withLoader(initialize)
      : await initialize();
  }

  /**
   * Clean up the view and remove it from the scene.
   */
  public abstract destroy(): void;

  /**
   * Notify the store that this view has been loaded.
   */
  protected flagAsLoaded() {
    Store.world.addViewLoaded(this.namespace);
  }

  /**
   * Notify the store that this view is loading.
   */
  protected flagAsLoading() {
    Store.world.addViewsToLoad(this.namespace);
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
