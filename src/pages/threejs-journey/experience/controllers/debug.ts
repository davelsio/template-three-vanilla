import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { FpsGraphBladeApi } from '@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph';
import { FolderApi, Pane } from 'tweakpane';

import { debugStore, Store, worldStore } from '../store';
import { InputConfig } from '../types/debug';

export class DebugController {
  private static _panel: Pane;
  private static _folders: Record<string, FolderApi>;
  private static _fpsGraph: FpsGraphBladeApi;

  public static namespace = 'DebugController';

  public static init() {
    const active = window.location.href.endsWith('#debug');
    if (!active) return;
    debugStore.enableDebug();

    this._panel = new Pane({ title: 'Debug Options' });
    this._panel.hidden = true;
    this._panel.registerPlugin(EssentialsPlugin);
    this._folders = {};

    this.setupBasePanel();
    this.setupSubscriptions();
  }

  public static destroy() {
    Store.subscriptions[this.namespace].forEach((unsub) => unsub());
    this._fpsGraph?.dispose();
    this._panel?.dispose();
    this._folders = {};
  }

  /* SETUP */

  private static setupBasePanel() {
    this._fpsGraph = this._panel.addBlade({
      view: 'fpsgraph',
      label: 'FPS',
      lineCount: 2,
    }) as FpsGraphBladeApi;
  }

  private static setupSubscriptions() {
    debugStore.subscribe(
      (state) => state.panels,
      (panels) => this.addConfig(panels[panels.length - 1])
    );

    const metaFrameSub = Store.time.subscribe(
      (state) => [state.beforeFrame, state.afterFrame],
      ([beforeFrame, afterFrame]) => {
        beforeFrame && this._fpsGraph.begin();
        afterFrame && this._fpsGraph.end();
      }
    );

    const worldSub = worldStore.subscribe(
      (state) => state.loadingReady,
      (loadingReady) => {
        if (loadingReady) this._panel.hidden = false;
      }
    );

    Store.subscriptions[this.namespace].push(metaFrameSub, worldSub);
  }

  /* CALLBACKS */

  private static addConfig(config: InputConfig) {
    const { folder, inputs } = config;

    // Declare where to add the new config, to the base pane or a folder
    let ui: Pane | FolderApi = this._panel;
    if (folder) {
      const title = folder.title;
      if (!this._folders[title]) {
        this._folders[title] = this._panel.addFolder(folder);
      }
      ui = this._folders[title];
    }

    // Add each input using the pane API
    inputs.forEach((input) => {
      ui.addInput(input.object, input.key, input.options);
      if (input.onChange) {
        ui.on('change', input.onChange);
      }
    });
  }
}
