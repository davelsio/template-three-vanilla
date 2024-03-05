import { debugConfig } from '@debug/debugConfig';
import { BaseController } from '@helpers/BaseController';
import { Store } from '@state/Store';
import {
  Bindable,
  BindingParams,
  BladeApi,
  BladeController,
  FolderParams,
  TpChangeEvent,
  View,
} from '@tweakpane/core';
import { BindingApi } from '@tweakpane/core/src/blade/binding/api/binding';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';
import { FolderApi, Pane } from 'tweakpane';

export type BindingPanel<T extends Bindable = Bindable> = {
  bindings: BindingItem<T>[];
  folder?: FolderParams;
};

export type BindingItem<T extends Bindable = Bindable> = {
  object: T;
  key: keyof T;
  options?: BindingParams;
  onChange?: Parameters<BindingApi<T[keyof T], T[keyof T]>['on']>[1];
};

export type BaseOnChange = (
  ev: TpChangeEvent<unknown, BladeApi<BladeController<View>>>
) => void;

export class DebugController extends BaseController {
  private _fpsGraph?: FpsGraphBladeApi;
  private _fpsRunning: boolean;
  private _folders: Record<string, FolderApi>;
  private _panel: Pane;

  public constructor() {
    super('DebugController');

    this._panel = new Pane({ title: 'Debug Options' });
    this._folders = {};
    this._fpsRunning = false;

    const active = window.location.href.endsWith('/debug');
    if (!active) return;

    Store.debug.enableDebug();
    this.setupPanels();
    this.setupSubscriptions();
  }

  public destroy() {
    Store.unsubscribe(this.namespace);
    Store.debug.destroy();
    this._fpsGraph?.dispose();
    this._fpsRunning = false;
    this._panel?.dispose();
    this._folders = {};
  }

  /* SETUP */

  private setupPanels() {
    this._panel.hidden = true;
    this._panel.expanded = false;
    this._panel.registerPlugin(EssentialsPlugin);
    this._folders = {};

    this._fpsGraph = this._panel.addBlade({
      view: 'fpsgraph',
      label: 'FPS',
      lineCount: 2,
    }) as FpsGraphBladeApi;

    debugConfig.forEach(({ folder, bindings }) => {
      this.addConfig({
        folder,
        bindings: bindings.map((binding) => ({
          ...binding,
          object: Store.debug.state,
          onChange: Store.debug.updateBinding,
        })),
      });
    });
  }

  private setupSubscriptions() {
    Store.world.subscribe(
      this.namespace,
      (state) => state.viewsProgress,
      (progress) => {
        if (progress === 1) this._panel.hidden = false;
      }
    );

    Store.time.subscribe(
      this.namespace,
      (state) => state.elapsed,
      (_) => {
        this._fpsRunning && this._fpsGraph?.end();
        this._fpsGraph?.begin();
        if (!this._fpsRunning) {
          this._fpsRunning = true;
        }
      }
    );
  }

  /* CALLBACKS */

  /**
   * Add a new configuration to the panel.
   * @param folder optional folder where to add the config
   * @param bindings array of bindings
   */
  private addConfig = ({ folder, bindings }: BindingPanel) => {
    // Declare where to add the new config, to the base pane or a folder
    let ui: Pane | FolderApi = this._panel;
    if (folder) {
      const title = folder.title;
      if (!this._folders[title]) {
        this._folders[title] = this._panel.addFolder(folder);
      }
      ui = this._folders[title];
    }

    // Add each binding using the appropriate API
    bindings.forEach((input) => {
      ui.addBinding(input.object, input.key, input.options);
      if (input.onChange) {
        ui.on('change', input.onChange as unknown as BaseOnChange);
      }
    });
  };
}
