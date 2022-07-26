import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { FpsGraphBladeApi } from '@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph';
import { FolderApi, Pane } from 'tweakpane';
import { subscribeWithSelector } from 'zustand/middleware';
import createStore from 'zustand/vanilla';

import { Store } from '../store';
import { InputArgs, InputItem } from '../types/debug';
import { Subscription } from '../types/store';

interface State {
  active: boolean;
  inputs: Record<string, InputItem[]>;

  /**
   * Add an array of inputs to the debug panel.
   * @param args inputs and optional folder config
   */
  addInputs: (args: InputArgs) => void;
}

export class DebugController {
  private static _subscriptions: Subscription[] = [];

  private static _panel: Pane;
  private static _folders: Record<string, FolderApi>;

  private static _state = createStore(
    subscribeWithSelector<State>((set) => ({
      active: false,
      inputs: {},

      addInputs: ({ inputs, folder }) => {
        // Declare the pane API as either the base pane or a folder
        let ui: Pane | FolderApi = this._panel;
        let folderTitle = 'base';
        if (folder) {
          folderTitle = folder.title;
          if (!this._folders[folderTitle]) {
            this._folders[folderTitle] = this._panel.addFolder(folder);
          }
          ui = this._folders[folderTitle];
        }

        // Add each input using the pane API
        inputs.forEach((input) => {
          ui.addInput(input.object, input.key, input.options);
          if (input.onChange) {
            ui.on('change', input.onChange);
          }
        });

        // Store the panel config in the state (currently unused)
        set((state) => {
          const newInputs = Object.assign({}, state.inputs);
          newInputs[folderTitle]
            ? newInputs[folderTitle].push(...inputs)
            : (newInputs[folderTitle] = inputs);
          return {
            inputs: newInputs,
          };
        });
      },
    }))
  );

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
  }

  private static setupSubscriptions() {
    const worldSub = Store.world.subscribe((state) => {
      if (state.worldReady) {
        this._panel.hidden = false;
      }
    });
    this._subscriptions.push(worldSub);
  }
}
