import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';
import debugStore from './debug';
import resourceStore from './resources';
import stageStore from './stage';
import timeStore from './time';
import WorldState from './world';

const subscriptions = defaultDict<Subscription[]>(() => []);

export class Store {
  private static _world: WorldState | null;

  public static get world() {
    if (!this._world)
      throw new Error('Trying to access world state before initialization');
    return this._world;
  }

  public static init() {
    this._world = new WorldState();
  }

  public static destroy() {
    this._world?.destroy();
    this._world = null;
  }
}

export {
  debugStore,
  resourceStore,
  stageStore,
  subscriptions,
  timeStore,
  // worldStore,
};
