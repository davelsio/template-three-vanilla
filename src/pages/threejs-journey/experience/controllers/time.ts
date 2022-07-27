import { Clock } from 'three';

import { timeStore } from '../store';

export class TimeController {
  private static _clock: Clock;
  private static _current: number;
  private static _start: number;

  private static _animationHandle: number;

  public static init() {
    this._clock = new Clock();
    this._start = this._clock.getElapsedTime();
    this._current = this._start;

    this._animationHandle = window.requestAnimationFrame(this.tick);
  }

  public static destroy() {
    window.cancelAnimationFrame(this._animationHandle);
  }

  /*  CALLBACKS */

  private static tick = () => {
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
