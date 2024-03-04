import { Store } from '@state/Store';
import { Clock } from 'three';

export class TimeController {
  private _clock: Clock;
  private _current: number;
  private _start: number;

  private _animationHandle: number;

  public constructor() {
    this._clock = new Clock();
    this._start = this._clock.getElapsedTime();
    this._current = this._start;

    this._animationHandle = window.requestAnimationFrame(this.tick);
  }

  public destroy() {
    window.cancelAnimationFrame(this._animationHandle);
  }

  /*  CALLBACKS */

  private tick = () => {
    const newCurrent = this._clock.getElapsedTime();
    const delta = newCurrent - this._current;
    const elapsed = newCurrent - this._start;
    this._current = newCurrent;

    Store.time.update({ delta, elapsed });

    this._animationHandle = window.requestAnimationFrame(this.tick);
  };
}
