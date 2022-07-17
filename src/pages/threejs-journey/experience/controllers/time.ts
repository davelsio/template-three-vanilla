import { Subject } from 'rxjs';
import { Clock } from 'three';

export class TimeController {
  private static _clock: Clock;
  private static _current: number;
  private static _start: number;

  private static _animationHandle: number;

  private static _afterFrame = new Subject<void>();
  private static _beforeFrame = new Subject<void>();
  private static _frame = new Subject<{ delta: number; elapsed: number }>();

  public static get state() {
    return {
      afterFrame: this._afterFrame,
      beforeFrame: this._beforeFrame,
      frame: this._frame,
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
    this._afterFrame.complete();
    this._beforeFrame.complete();
    this._frame.complete();
  }

  /*  CALLBACKS */

  private static tick = () => {
    const newCurrent = this._clock.getElapsedTime();
    const delta = newCurrent - this._current;
    const elapsed = newCurrent - this._start;

    this._current = newCurrent;

    this._beforeFrame.next();
    this._frame.next({ delta, elapsed });
    this._afterFrame.next();

    this._animationHandle = window.requestAnimationFrame(this.tick);
  };
}
