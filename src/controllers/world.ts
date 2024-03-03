import { WebGLView } from '@helpers/webgl-view';
import { Store } from '@state/store';
import { Fireflies } from '@views/fireflies';
import { Loading } from '@views/loading';
import { Portal } from '@views/portal';
import { Scene } from 'three';

type WorldOptions = {
  loading?: boolean;
};

export class WorldController {
  private _views: WebGLView[] = [];

  private _options: WorldOptions = {
    loading: true,
  };

  public namespace = 'WorldController';
  public scene: Scene;

  public constructor(scene: Scene, options?: WorldOptions) {
    this._options = Object.assign({}, this._options, options);

    // Create world scene
    this.scene = scene;

    // Create view instances
    if (this._options.loading) {
      this._views.push(new Loading(this.scene));
    }
    this._views.push(new Portal(this.scene));
    this._views.push(new Fireflies(this.scene));
  }

  public destroy() {
    this._views.forEach((view) => view.destroy());
    Store.world.unsubscribe(this.namespace);
    Store.world.destroy();
  }
}
