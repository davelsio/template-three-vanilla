import { Clock } from 'three';

import { timeStore } from '../store';

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

    timeStore.state.update({ afterFrame: false, beforeFrame: true });
    timeStore.state.update({
      delta,
      elapsed,
      afterFrame: false,
      beforeFrame: false,
    });
    timeStore.state.update({ beforeFrame: false, afterFrame: true });

    this._animationHandle = window.requestAnimationFrame(this.tick);
  };
}
