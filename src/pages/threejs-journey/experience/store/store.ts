import {
  ResourceController,
  StageController,
  TimeController,
} from '../controllers';
import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';

export class Store {
  public static get resources() {
    return ResourceController.state;
  }

  public static get stage() {
    return StageController.state;
  }

  public static get time() {
    return TimeController.state;
  }

  public static subscriptions = defaultDict<Subscription[]>(() => []);
}
