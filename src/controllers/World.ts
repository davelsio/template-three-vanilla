import { BaseController } from '@helpers/BaseController';
import { WebGLView } from '@helpers/WebGLView';
import { Store } from '@state/Store';
import { Fireflies } from '@views/Fireflies';
import { Loading } from '@views/Loading';
import { Portal } from '@views/Portal';
import { Scene } from 'three';

type WorldOptions = {
  loader?: boolean;
};

export class WorldController extends BaseController<WorldOptions> {
  public scene: Scene;

  private _views: WebGLView[] = [];

  public constructor(scene: Scene) {
    super('WorldController', {
      loader: true,
    });

    // Create world scene
    this.scene = scene;

    // Create view instances
    if (this._props.loader) {
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
