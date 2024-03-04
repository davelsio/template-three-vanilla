import { StateNotInitializedError } from '@errors/StateNotInitializedError';

import DebugStore from './Debug';
import ResourceStore from './Resources';
import StageStore from './Stage';
import TimeStore from './Time';
import WorldStore from './World';

export class Store {
  private static _debug: DebugStore | null;
  private static _resources: ResourceStore | null;
  private static _stage: StageStore | null;
  private static _time: TimeStore | null;
  private static _world: WorldStore | null;

  public static get debug() {
    if (!this._debug) throw new StateNotInitializedError('debug');
    return this._debug;
  }

  public static get resources() {
    if (!this._resources) throw new StateNotInitializedError('resources');
    return this._resources;
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
    this._debug = new DebugStore();
    this._resources = new ResourceStore();
    this._stage = new StageStore();
    this._time = new TimeStore();
    this._world = new WorldStore();
  }

  /**
   * Destroy all state listeners and set state instances as null for garbage
   * collection.
   */
  public static destroy() {
    this._debug?.destroy();
    this._debug = null;

    this._resources?.destroy();
    this._resources = null;

    this._stage?.destroy();
    this._debug = null;

    this._time?.destroy();
    this._time = null;

    this._world?.destroy();
    this._world = null;
  }
}
