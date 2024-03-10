import { Pane } from 'tweakpane';
import {
  Bindable,
  BindingParams,
  FolderApi,
  FolderParams,
} from '@tweakpane/core';

import { StateBundle } from '@debug/StateBundle';
import { BaseController } from '@helpers/BaseController';
import { StoreInstance } from '@helpers/StoreInstance';
import { cameraConfig, CameraSettings } from '@settings/camera';
import { debugConfig, DebugSettings } from '@settings/debug';
import { renderConfig, RenderSettings } from '@settings/renderer';
import { timeConfig, TimeSettings } from '@settings/time';
import { worldConfig, WorldSettings } from '@settings/world';
import { Store } from '@state/Store';

/**
 * Binding panels configuration object.
 */
export type BindingConfig<T extends Bindable = Bindable> = {
  folder?: FolderParams;
  bindings: Array<{
    key: keyof T;
    options?: BindingParams & {
      condition?: keyof T;
    };
  }>;
};

/**
 * Setting types
 */
export type Settings =
  | CameraSettings
  | DebugSettings
  | RenderSettings
  | TimeSettings
  | WorldSettings;

export class DebugController extends BaseController {
  private _folders: Record<string, FolderApi>;
  private _panel: Pane;

  public constructor() {
    super('DebugController');

    const active = window.location.href.endsWith('/debug');
    if (!active) return;

    this._panel = new Pane({ title: 'Debug Options' });
    this._folders = {};

    Store.debug.enableDebug();
    this.setupPanels();
    this.setupSubscriptions();
  }

  public destroy() {
    Store.unsubscribe(this.namespace);
    Store.debug.destroy();
    this._panel?.dispose();
    this._folders = {};
  }

  /* SETUP */

  private setupPanels() {
    const { expanded } = Store.debug.state;
    this._panel.hidden = true;
    this._panel.expanded = expanded;
    this._folders = {};

    this._panel.registerPlugin(StateBundle);

    this.setupConfig(debugConfig, Store.debug);
    this.setupConfig(timeConfig, Store.time);
    this.setupConfig(cameraConfig, Store.camera);
    this.setupConfig(renderConfig, Store.render);
    this.setupConfig(worldConfig, Store.world);
  }

  /**
   * Initialize config panels for each store.
   * @param config binding config object
   * @param store store instance
   */
  private setupConfig<T extends Settings>(
    config: BindingConfig<T>[],
    store: StoreInstance<T>
  ) {
    config.forEach(({ folder, bindings }) => {
      const ui: Pane | FolderApi = folder
        ? this.getFolder(folder)
        : this._panel;

      bindings.forEach(({ key, options }) => {
        ui.addBinding(store.state, key, {
          ...options,
          reader: (target) => store.state[target.key as keyof T],
          writer: (target, value) =>
            store.update({ [target.key]: value } as Partial<T>),
        });
      });
    });
  }

  /**
   * Retrieve or create a new folder panel.
   * @param folder folder parameters
   */
  private getFolder = (folder: FolderParams) => {
    const title = folder.title;
    if (!this._folders[title]) {
      this._folders[title] = this._panel.addFolder(folder);
    }
    return this._folders[title];
  };

  /* SUBSCRIPTIONS */

  private setupSubscriptions() {
    const { world } = Store.getSubscribers(this.namespace);
    world((state) => state.viewsProgress, this.toggleDebugPanel);
  }

  private toggleDebugPanel = (progress: number) => {
    if (progress === 1) this._panel.hidden = false;
  };
}
