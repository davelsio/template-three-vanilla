import { Camera } from 'three';
import { OrbitControls } from 'three-stdlib';

import { Store } from '@state/Store';

export interface ExperienceState {
  camera: Camera;
  controls: OrbitControls;
}

export class ExperienceApi {
  public readonly namespace: string;

  public get camera() {
    return this._state.camera;
  }

  public get controls() {
    return this._state.controls;
  }

  private _state: ExperienceState;

  private _subscribers: ReturnType<typeof Store.getSubscribers>;

  constructor(namespace: string, state: ExperienceState) {
    this.namespace = namespace;
    this._state = state;
    this._subscribers = Store.getSubscribers(this.namespace);
  }

  public onLoad(callback: () => void) {
    const unsub = this._subscribers.world(
      (state) => state.viewsProgress,
      (viewsProgress) => {
        if (viewsProgress === 1) {
          callback();
          unsub();
        }
      }
    );
  }
}
