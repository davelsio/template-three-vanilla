import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { FpsGraphBladeApi } from '@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph';
import { FolderApi, FolderParams, Pane } from 'tweakpane';
import createStore from 'zustand/vanilla';

import { Store } from '../store';
import { InputArgs } from '../types/debug';
import { Subscription as _Subscription } from '../types/store';

export class DebugController {
  private static _subscriptions: _Subscription[] = [];

  private static _panel: Pane;
  private static _folders: Record<string, FolderApi>;

  private static _state = createStore(() => ({
    active: false,
  }));

  public static get state() {
    return {
      ...this._state.getState(),
      subscribe: this._state.subscribe,
    };
  }

  public static init() {
    this._state.setState({
      active: window.location.href.endsWith('#debug'),
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
    this._subscriptions.forEach((unsub) => unsub());
    this._state.destroy();

    this._panel.dispose();
    this._folders = {};
  }

  /* SETUP */

  private static setupBasePanel() {
    this.setupFps();
  }

  private static setupSubscriptions() {
    const worldSub = Store.world.subscribe((state) => {
      if (state.worldReady) {
        this._panel.hidden = false;
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

    const beforeFrameSub = Store.time.subscribe((state) => {
      if (state.beforeFrame) fpsGraph.begin();
    });
    this._subscriptions.push(beforeFrameSub);

    const afterFrameSub = Store.time.subscribe((state) => {
      if (state.afterFrame) fpsGraph.end();
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
