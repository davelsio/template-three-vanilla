import { BaseController } from '@helpers/BaseController';
import { Store } from '@state/Store';
import { Clock } from 'three';

export class TimeController extends BaseController {
  private _animationHandle: number;
  private _clock: Clock;
  private _current: number;
  private _start: number;

  public constructor() {
    super('TimeController', {});

    this._clock = new Clock();
    this._start = this._clock.getElapsedTime();
    this._current = this._start;
    this._animationHandle = window.requestAnimationFrame(this.tick);
  }

  public destroy() {
    window.cancelAnimationFrame(this._animationHandle);
    Store.time.destroy();
  }

  /*  CALLBACKS */

  private tick = () => {
    const newCurrent = this._clock.getElapsedTime();
    const delta = newCurrent - this._current;
    const elapsed = newCurrent - this._start;
    this._current = newCurrent;
    const fps = 1 / delta;

    Store.time.update({ delta, elapsed, fps });

    this._animationHandle = window.requestAnimationFrame(this.tick);
  };
}
