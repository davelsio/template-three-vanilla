import { StateNotInitializedError } from '@errors/StateNotInitializedError';
import { ApiStore } from '@state/Api';

import { CameraStore } from './Camera';
import { DebugStore } from './Debug';
import { RenderStore } from './Render';
import { ResourceStore } from './Resources';
import { StageStore } from './Stage';
import { TimeStore } from './Time';
import { WorldStore } from './World';

export class Store {
  private static _api: ApiStore | null;
  private static _camera: CameraStore | null;
  private static _debug: DebugStore | null;
  private static _render: RenderStore | null;
  private static _resources: ResourceStore | null;
  private static _stage: StageStore | null;
  private static _time: TimeStore | null;
  private static _world: WorldStore | null;

  public static get api() {
    if (!this._api) throw new StateNotInitializedError('api');
    return this._api;
  }

  public static get camera() {
    if (!this._camera) throw new StateNotInitializedError('camera');
    return this._camera;
  }

  public static get debug() {
    if (!this._debug) throw new StateNotInitializedError('debug');
    return this._debug;
  }

  public static get render() {
    if (!this._render) throw new StateNotInitializedError('render');
    return this._render;
  }

  public static get resources() {
    if (!this._resources) throw new StateNotInitializedError('resources');
    return this._resources;
  }

  public static get stage() {
    if (!this._stage) throw new StateNotInitializedError('stage');
    return this._stage;
  }

  public static get time() {
    if (!this._time) throw new StateNotInitializedError('time');
    return this._time;
  }

  public static get world() {
    if (!this._world) throw new StateNotInitializedError('world');
    return this._world;
  }

  public static init() {
    this._api = new ApiStore();
    this._camera = new CameraStore();
    this._debug = new DebugStore();
    this._render = new RenderStore();
    this._resources = new ResourceStore();
    this._stage = new StageStore();
    this._time = new TimeStore();
    this._world = new WorldStore();
  }

  /**
   * Get all state instances.
   */
  public static getStates() {
    return {
      api: this.api.state,
      camera: this.camera.state,
      debug: this.debug.state,
      render: this.render.state,
      resources: this.resources.state,
      stage: this.stage.state,
      time: this.time.state,
      world: this.world.state,
    };
  }

  /**
   * Get store subscribers for a given namespace.
   * @param namespace the namespace
   */
  public static getSubscribers(namespace: string) {
    return {
      api: this.api.getSubscriber(namespace),
      camera: this.camera.getSubscriber(namespace),
      debug: this.debug.getSubscriber(namespace),
      render: this.render.getSubscriber(namespace),
      resources: this.resources.getSubscriber(namespace),
      stage: this.stage.getSubscriber(namespace),
      time: this.time.getSubscriber(namespace),
      world: this.world.getSubscriber(namespace),
    };
  }

  /**
   * Get store updaters for all state instances.
   */
  public static getUpdaters() {
    return {
      api: this.api.update,
      camera: this.camera.update,
      debug: this.debug.update,
      render: this.render.update,
      resources: this.resources.update,
      stage: this.stage.update,
      time: this.time.update,
      world: this.world.update,
    };
  }

  /**
   * Unsubscribe from all state listeners for a given namespace.
   * @param namespace the namespace to unsubscribe
   */
  public static unsubscribe(namespace: string) {
    this._api?.unsubscribe(namespace);
    this._camera?.unsubscribe(namespace);
    this._debug?.unsubscribe(namespace);
    this._render?.unsubscribe(namespace);
    this._resources?.unsubscribe(namespace);
    this._stage?.unsubscribe(namespace);
    this._time?.unsubscribe(namespace);
    this._world?.unsubscribe(namespace);
  }

  /**
   * Destroy all state listeners and set state instances as null for garbage
   * collection.
   */
  public static destroy() {
    this._api?.destroy();
    this._api = null;

    this._camera?.destroy();
    this._camera = null;

    this._debug?.destroy();
    this._debug = null;

    this._render?.destroy();
    this._render = null;

    this._resources?.destroy();
    this._resources = null;

    this._stage?.destroy();
    this._debug = null;

    this._time?.destroy();
    this._time = null;

    this._world?.destroy();
    this._world = null;
  }
}
