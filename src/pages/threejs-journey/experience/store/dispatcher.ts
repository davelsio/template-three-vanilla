import { DebugController } from '../controllers';
import { DebugAction, Dispatch } from '../types/store';

export class Dispatcher {
  public static dispatch(dispatch: Dispatch) {
    const { controller, action } = dispatch;

    switch (controller) {
      case 'DebugController':
        Dispatcher.forwardDebugAction(action);
        break;
    }
  }

  private static forwardDebugAction(action: DebugAction) {
    const { type, payload } = action;

    switch (type) {
      case 'ADD_INPUT':
        DebugController.addInput(payload);
        break;

      case 'ADD_FOLDER':
        DebugController.addFolder(payload);
        break;
    }
  }
}
