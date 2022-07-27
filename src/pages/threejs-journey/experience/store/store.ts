import { Subscription } from '../types/store';
import { defaultDict } from '../utils/default-dict';

export class Store {
  public static subscriptions = defaultDict<Subscription[]>(() => []);
}
