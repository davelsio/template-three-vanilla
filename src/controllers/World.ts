import { BaseController } from '@helpers/BaseController';
import { WebGLView } from '@helpers/WebGLView';
import { Store } from '@state/Store';
import { Views } from '@views/index';

export class WorldController extends BaseController {
  private _views: WebGLView[] = [];

  public constructor() {
    super('WorldController');
    this._views = Views.map((View) => new View());
  }

  public destroy() {
    this._views.forEach((view) => view.destroy());
    Store.unsubscribe(this.namespace);
    Store.world.destroy();
  }
}
