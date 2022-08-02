import { StateNotInitializedError } from '../helpers/error';
import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';
import DebugState from './debug';
import resourceStore from './resources';
import StageState from './stage';
import TimeState from './time';
import WorldState from './world';

const subscriptions = defaultDict<Subscription[]>(() => []);

export class Store {
  private static _debug: DebugState | null;
  private static _stage: StageState | null;
  private static _time: TimeState | null;
  private static _world: WorldState | null;

  public static get debug() {
    if (!this._debug) throw new StateNotInitializedError('debug');
    return this._debug;
  }

  public static get stage() {
    if (!this._stage) throw new StateNotInitializedError('stage');
    return this._stage;
  }

  public static get time() {
    if (!this._time) throw new StateNotInitializedError('time');
    return this._time;
  }

  public static get world() {
    if (!this._world) throw new StateNotInitializedError('world');
    return this._world;
  }

  public static init() {
    this._debug = new DebugState();
    this._stage = new StageState();
    this._time = new TimeState();
    this._world = new WorldState();
  }

  /**
   * Destroy all state listeners and set state instances as null for garbage
   * collection.
   */
  public static destroy() {
    this._debug?.destroy();
    this._debug = null;

    this._stage?.destroy();
    this._debug = null;

    this._time?.destroy();
    this._time = null;

    this._world?.destroy();
    this._world = null;
  }
}

export {
  // debugStore,
  resourceStore,
  // stageStore,
  subscriptions,
  // timeStore,
  // worldStore,
};
