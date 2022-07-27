import { ResourceController } from '../controllers';
import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';

export class Store {
  public static get resources() {
    return ResourceController.state;
  }

  public static subscriptions = defaultDict<Subscription[]>(() => []);
}
