import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';
import debugStore from './debug';
import resourceStore from './resources';
import stageStore from './stage';
import timeStore from './time';
import worldStore from './world';

const subscriptions = defaultDict<Subscription[]>(() => []);

export {
  debugStore,
  resourceStore,
  stageStore,
  subscriptions,
  timeStore,
  worldStore,
};
