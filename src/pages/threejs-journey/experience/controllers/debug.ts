import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { FpsGraphBladeApi } from '@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FolderApi, FolderParams, Pane } from 'tweakpane';

import { Store } from '../store';
import { InputArgs } from '../types/debug';

export class DebugController {
  private static _subscriptions: Subscription[] = [];

  private static _panel: Pane;
  private static _folders: Record<string, FolderApi>;

  private static _state = new BehaviorSubject({
    active: false,
  });

  public static get state() {
    return {
      ...this._state.getValue(),
      subscribe: this._state.subscribe.bind(this._state),
    };
  }

  public static init() {
    this._state.next({
      active: window.location.hash === '#debug',
    });
    if (!this.state.active) return;

    this._panel = new Pane({ title: 'Debug Options' });
    this._panel.hidden = true;
    this._panel.registerPlugin(EssentialsPlugin);
    this._folders = {};

    this.setupBasePanel();
    this.setupSubscriptions();
  }

  public static destroy() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this._state.complete();

    this._panel.dispose();
    this._folders = {};
  }

  /* SETUP */

  private static setupBasePanel() {
    this.setupFps();
  }

  private static setupSubscriptions() {
    const worldSub = Store.world.subscribe((state) => {
      if (state.viewsProgress === 1) {
        setTimeout(() => {
          this._panel.hidden = false;
        }, 500);
      }
    });
    this._subscriptions.push(worldSub);
  }

  /* CALLBACKS */

  private static setupFps = () => {
    const fpsGraph = this._panel.addBlade({
      view: 'fpsgraph',
      label: 'FPS',
      lineCount: 2,
    }) as FpsGraphBladeApi;

    const beforeFrameSub = Store.time.beforeFrame.subscribe(() => {
      fpsGraph.begin();
    });
    this._subscriptions.push(beforeFrameSub);

    const afterFrameSub = Store.time.afterFrame.subscribe(() => {
      fpsGraph.end();
    });
    this._subscriptions.push(afterFrameSub);
  };

  /* MUTATIONS */

  public static addInput(inputArgs: InputArgs) {
    let ui: Pane | FolderApi = this._panel;
    if (inputArgs.folder) {
      this.addFolder(inputArgs.folder);
      ui = this._folders[inputArgs.folder.title];
    }

    inputArgs.inputs.forEach((input) => {
      ui.addInput(input.object, input.key, input.options);
      if (input.onChange) {
        ui.on('change', input.onChange);
      }
    });
  }

  public static addFolder(folder: FolderParams) {
    if (!this._folders[folder.title]) {
      this._folders[folder.title] = this._panel.addFolder(folder);
    }
  }
}
