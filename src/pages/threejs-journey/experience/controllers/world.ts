import { Scene } from 'three';

import { subscriptions, worldStore } from '../store';
import { Fireflies } from '../views/fireflies';
import { Loading } from '../views/loading';
import { Portal } from '../views/portal';

export class WorldController {
  private static _loading: Loading;
  private static _portal: Portal;
  private static _fireflies: Fireflies;
  private static _viewsToLoad: string[] = [];

  public static namespace = 'WorldController';

  public static scene: Scene;

  public static init() {
    this.scene = new Scene();

    // Load each view constructor, so we have access to their namespaces
    this._loading = new Loading();
    this._portal = new Portal();
    this._fireflies = new Fireflies();

    // Update the state with the views to load
    this._viewsToLoad = [this._portal.namespace, this._fireflies.namespace];

    // Start loading views and subscriptions
    this.initViews();
    this.setupSubscriptions();
  }

  public static destroy() {
    this._fireflies.destroy();
    this.scene.remove(this._fireflies);

    this._portal.destroy();
    this.scene.remove(this._portal);

    subscriptions[this.namespace].forEach((unsub) => unsub());
  }

  private static initViews() {
    this._loading.init();
    this.scene.add(this._loading);

    this._portal.init();
    this.scene.add(this._portal);

    this._fireflies.init();
    this.scene.add(this._fireflies);
  }

  private static setupSubscriptions() {
    subscriptions[this.namespace].push(
      worldStore.subscribe(
        (state) => state.viewsLoaded,
        (viewsLoaded) => {
          const viewsProgress = viewsLoaded.length / this._viewsToLoad.length;
          worldStore.updateProgress(viewsProgress);
        }
      ),
      worldStore.subscribe(
        (state) => [state.loadingReady, state.viewsReady],
        ([loadingReady, worldReady]) => {
          // Remove the loading progress once the world is ready
          if (loadingReady && worldReady) {
            this._loading.destroy();
            this.scene.remove(this._loading);
          }
        }
      )
    );
  }
}
