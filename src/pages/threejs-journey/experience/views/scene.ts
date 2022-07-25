import { Scene } from 'three';

import { Store } from '../store';
import { Subscription } from '../types/store';
import { WebGLView } from '../types/ui';
import { Fireflies } from './fireflies';
import { Loading } from './loading';
import { Portal } from './portal';

export class SceneView extends Scene implements WebGLView {
  private _fireflies: Fireflies;
  private _loading: Loading;
  private _portal: Portal;

  private _subscriptions: Subscription[] = [];

  public namespace = 'Scene';

  constructor() {
    super();
    this.init();
  }

  public init() {
    // Load each view constructor, so we have access to their namespaces
    this._loading = new Loading();
    this._portal = new Portal();
    this._fireflies = new Fireflies();

    // Update the WorldController state with the views to load
    Store.world.addViews([this._portal.namespace, this._fireflies.namespace]);

    // Setup the listeners
    this.setupSubscriptions();

    // Asynchronously initialize and add each view
    this._loading.init();
    this.add(this._loading);

    this._portal.init();
    this.add(this._portal);

    this._fireflies.init();
    this.add(this._fireflies);
  }

  public destroy() {
    this._fireflies.destroy();
    this.remove(this._fireflies);
    this._portal.destroy();
    this.remove(this._portal);
    this._subscriptions.forEach((unsub) => unsub());
  }

  /* SETUP */

  private setupSubscriptions() {
    const worldSub = Store.world.subscribe((state) => {
      // Remove the loading progress once the world is ready
      if (state.worldReady) {
        this._loading.destroy();
        this.remove(this._loading);
      }
    });
    this._subscriptions.push(worldSub);
  }
}
