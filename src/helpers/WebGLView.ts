import { Store } from '@state/store';
import { Group, Scene } from 'three';

export abstract class WebGLView<T extends {} = {}> extends Group {
  public namespace: string;
  protected _props: T;
  protected _scene: Scene;

  protected constructor(scene: Scene, props: T) {
    super();
    this._props = props;
    this._scene = scene;
    this._scene.add(this);
  }

  public abstract init(): Promise<void>;
  public abstract destroy(): void;

  protected flagAsLoaded() {
    Store.world.addViewLoaded(this.namespace);
  }

  protected flagAsLoading() {
    Store.world.addViewsToLoad(this.namespace);
  }
}
