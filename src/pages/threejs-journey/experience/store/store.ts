import {
  DebugController,
  ResourceController,
  StageController,
  TimeController,
  WorldController,
} from '../controllers';
import { Dispatcher } from './dispatcher';

export class Store {
  public static get debug() {
    return DebugController.state;
  }

  public static get resources() {
    return ResourceController.state;
  }

  public static get stage() {
    return StageController.state;
  }

  public static get time() {
    return TimeController.state;
  }

  public static get world() {
    return WorldController.state;
  }

  // Actions
  public static dispatch = Dispatcher.dispatch;
}
