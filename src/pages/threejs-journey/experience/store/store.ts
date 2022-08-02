import { StateNotInitializedError } from '../helpers/error';
import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';
import DebugState from './debug';
import resourceStore from './resources';
import stageStore from './stage';
import timeStore from './time';
import WorldState from './world';

const subscriptions = defaultDict<Subscription[]>(() => []);

export class Store {
  private static _debug: DebugState | null;
  private static _world: WorldState | null;

  public static get debug() {
    if (!this._debug) throw new StateNotInitializedError('debug');
    return this._debug;
  }

  public static get world() {
    if (!this._world) throw new StateNotInitializedError('world');
    return this._world;
  }

  public static init() {
    this._world = new WorldState();
    this._debug = new DebugState();
  }

  /**
   * Destroy all state listeners and set state instances as null for garbage
   * collection.
   */
  public static destroy() {
    this._debug?.destroy();
    this._debug = null;

    this._world?.destroy();
    this._world = null;
  }
}

export {
  // debugStore,
  resourceStore,
  stageStore,
  subscriptions,
  timeStore,
  // worldStore,
};
