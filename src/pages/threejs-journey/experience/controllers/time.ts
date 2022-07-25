import { Clock } from 'three';
import createStore from 'zustand/vanilla';

export class TimeController {
  private static _clock: Clock;
  private static _current: number;
  private static _start: number;

  private static _animationHandle: number;

  private static _state = createStore(() => ({
    beforeFrame: false,
    delta: 16,
    elapsed: 0,
    afterFrame: false,
  }));

  public static get state() {
    return {
      ...this._state.getState(),
      subscribe: this._state.subscribe,
    };
  }

  public static init() {
    this._clock = new Clock();
    this._start = this._clock.getElapsedTime();
    this._current = this._start;

    this._animationHandle = window.requestAnimationFrame(this.tick);
  }

  public static destroy() {
    window.cancelAnimationFrame(this._animationHandle);
    this._state.destroy();
  }

  /*  CALLBACKS */

  private static tick = () => {
    const newCurrent = this._clock.getElapsedTime();
    const delta = newCurrent - this._current;
    const elapsed = newCurrent - this._start;

    this._current = newCurrent;

    this._state.setState({ afterFrame: false, beforeFrame: true });
    this._state.setState({
      delta,
      elapsed,
      afterFrame: false,
      beforeFrame: false,
    });
    this._state.setState({ beforeFrame: false, afterFrame: true });

    this._animationHandle = window.requestAnimationFrame(this.tick);
  };
}
