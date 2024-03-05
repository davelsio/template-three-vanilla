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

type Props = {
  fpsGraph?: FpsGraphBladeApi;
  fpsRunning: boolean;
  folders: Record<string, FolderApi>;
  panel: Pane;
};

export class DebugController extends BaseController<Props> {
  public constructor() {
    super('DebugController', {
      panel: new Pane({ title: 'Debug Options' }),
      folders: {},
      fpsRunning: false,
    });

    const active = window.location.href.endsWith('/debug');
    if (!active) return;

    Store.debug.enableDebug();
    this.setupPanels();
    this.setupSubscriptions();
  }

  public destroy() {
    Store.debug.unsubscribe(this.namespace);
    Store.time.unsubscribe(this.namespace);
    Store.world.unsubscribe(this.namespace);
    this._props.fpsGraph?.dispose();
    this._props.fpsRunning = false;
    this._props.panel?.dispose();
    this._props.folders = {};
  }

  /* SETUP */

  private setupPanels() {
    this._props.panel.hidden = true;
    this._props.panel.expanded = false;
    this._props.panel.registerPlugin(EssentialsPlugin);
    this._props.folders = {};

    this._props.fpsGraph = this._props.panel.addBlade({
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
        if (progress === 1) this._props.panel.hidden = false;
      }
    );

    Store.time.subscribe(
      this.namespace,
      (state) => state.elapsed,
      (_) => {
        this._props.fpsRunning && this._props.fpsGraph?.end();
        this._props.fpsGraph?.begin();
        if (!this._props.fpsRunning) {
          this._props.fpsRunning = true;
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
    let ui: Pane | FolderApi = this._props.panel;
    if (folder) {
      const title = folder.title;
      if (!this._props.folders[title]) {
        this._props.folders[title] = this._props.panel.addFolder(folder);
      }
      ui = this._props.folders[title];
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
