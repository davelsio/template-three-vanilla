import { BehaviorSubject } from 'rxjs';

import { SceneView } from '../views/scene';

export class WorldController {
  private static _viewsToLoad: string[] = [];

  private static _state = new BehaviorSubject<{
    viewsLoaded: string[];
    viewsProgress: number;
  }>({
    viewsLoaded: [],
    viewsProgress: 0,
  });

  public static get state() {
    return {
      ...this._state.getValue(),
      // observable: this._state.asObservable(),
      subscribe: this._state.subscribe.bind(this._state),
    };
  }
  public static scene: SceneView;

  public static init() {
    this.scene = new SceneView();
  }

  public static destroy() {
    this.scene.destroy();
    this._state.complete();
  }

  /* MUTATIONS */

  public static updateViewProgress(name: string) {
    const viewsLoaded = [...this._state.value.viewsLoaded, name];
    const viewsProgress = viewsLoaded.length / this._viewsToLoad.length;

    this._state.next({
      viewsLoaded,
      viewsProgress,
    });
  }

  public static updateViewsToLoad(names: string[]) {
    this._viewsToLoad.push(...names);
  }
}
