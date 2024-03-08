import { StateNotInitializedError } from '@errors/StateNotInitializedError';

import { CameraStore } from './Camera';
import { DebugStore } from './Debug';
import { RenderStore } from './Render';
import { ResourceStore } from './Resources';
import { StageStore } from './Stage';
import { TimeStore } from './Time';
import { WorldStore } from './World';

export class Store {
  private static _camera: CameraStore | null;
  private static _debug: DebugStore | null;
  private static _render: RenderStore | null;
  private static _resources: ResourceStore | null;
  private static _stage: StageStore | null;
  private static _time: TimeStore | null;
  private static _world: WorldStore | null;

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
    this._camera = new CameraStore();
    this._debug = new DebugStore();
    this._render = new RenderStore();
    this._resources = new ResourceStore();
    this._stage = new StageStore();
    this._time = new TimeStore();
    this._world = new WorldStore();
  }

  /**
   * Get store subscribers for a given namespace.
   * @param namespace the namespace
   */
  public static getSubscribers(namespace: string) {
    return {
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
   * Unsubscribe from all state listeners for a given namespace.
   * @param namespace the namespace to unsubscribe
   */
  public static unsubscribe(namespace: string) {
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
