import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { FpsGraphBladeApi } from '@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph';
import { FolderApi, Pane } from 'tweakpane';

import { Store } from '../store';
import { InputConfig } from '../types/debug';

export class DebugController {
  private _panel: Pane;
  private _folders: Record<string, FolderApi>;
  private _fpsGraph: FpsGraphBladeApi;

  public namespace = 'DebugController';

  public constructor() {
    const active = window.location.href.endsWith('#debug');
    if (!active) return;
    Store.debug.enableDebug();

    this._panel = new Pane({ title: 'Debug Options' });
    this._panel.hidden = true;
    this._panel.registerPlugin(EssentialsPlugin);
    this._folders = {};

    this.setupBasePanel();
    this.setupSubscriptions();
  }

  public destroy() {
    Store.debug.unsubscribe(this.namespace);
    Store.time.unsubscribe(this.namespace);
    Store.world.unsubscribe(this.namespace);
    this._fpsGraph?.dispose();
    this._panel?.dispose();
    this._folders = {};
  }

  /* SETUP */

  private setupBasePanel() {
    this._fpsGraph = this._panel.addBlade({
      view: 'fpsgraph',
      label: 'FPS',
      lineCount: 2,
    }) as FpsGraphBladeApi;
  }

  private setupSubscriptions() {
    Store.debug.subscribeNs(
      this.namespace,
      (state) => state.panels,
      (panels) => this.addConfig(panels[panels.length - 1])
    );

    Store.world.subscribeNs(
      this.namespace,
      (state) => state.loadingReady,
      (loadingReady) => {
        if (loadingReady) this._panel.hidden = false;
      }
    );

    Store.time.subscribeNs(
      this.namespace,
      (state) => [state.beforeFrame, state.afterFrame],
      ([beforeFrame, afterFrame]) => {
        beforeFrame && this._fpsGraph.begin();
        afterFrame && this._fpsGraph.end();
      }
    );
  }

  /* CALLBACKS */

  private addConfig(config: InputConfig) {
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
