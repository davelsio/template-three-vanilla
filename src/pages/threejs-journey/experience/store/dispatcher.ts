import { DebugController, WorldController } from '../controllers';
import { DebugAction, Dispatch, WorldAction } from '../types/store';

export class Dispatcher {
  public static dispatch(dispatch: Dispatch) {
    const { controller, action } = dispatch;

    switch (controller) {
      case 'DebugController':
        Dispatcher.forwardDebugAction(action);
        break;

      case 'WorldController':
        Dispatcher.forwardWorldAction(action);
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

  private static forwardWorldAction(action: WorldAction) {
    const { type, payload } = action;

    switch (type) {
      case 'UPDATE_VIEWS_TO_LOAD':
        WorldController.updateViewsToLoad(payload.names);
        break;

      case 'UPDATE_VIEW_PROGRESS':
        WorldController.updateViewProgress(payload.name);
        break;
    }
  }
}
