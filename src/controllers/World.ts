import { BaseController } from '@helpers/BaseController';
import { WebGLView } from '@helpers/WebGLView';
import { Store } from '@state/Store';
import { Fireflies } from '@views/Fireflies';
import { Loading } from '@views/Loading';
import { Portal } from '@views/Portal';
import { Scene } from 'three';

export class WorldController extends BaseController {
  public scene: Scene;

  private _views: WebGLView[] = [];

  public constructor(scene: Scene) {
    super('WorldController');

    // Create world scene
    this.scene = scene;

    // Create view instances
    const withLoader = Store.world.state.loader;
    if (withLoader) {
      this._views.push(new Loading(this.scene));
    }
    this._views.push(new Portal(this.scene));
    this._views.push(new Fireflies(this.scene));
  }

  public destroy() {
    this._views.forEach((view) => view.destroy());
    Store.unsubscribe(this.namespace);
    Store.world.destroy();
  }
}
