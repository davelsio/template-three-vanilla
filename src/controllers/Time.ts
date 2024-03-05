import { BaseController } from '@helpers/BaseController';
import { Store } from '@state/Store';
import { Clock } from 'three';

type Props = {
  clock: Clock;
  current: number;
  start: number;
  animationHandle?: number;
};

export class TimeController extends BaseController<Props> {
  public constructor() {
    const clock = new Clock();
    const time = clock.getElapsedTime();
    super('TimeController', {
      clock: clock,
      current: time,
      start: time,
    });

    this._props.animationHandle = window.requestAnimationFrame(this.tick);
  }

  public destroy() {
    if (this._props.animationHandle) {
      window.cancelAnimationFrame(this._props.animationHandle);
    }
  }

  /*  CALLBACKS */

  private tick = () => {
    const newCurrent = this._props.clock.getElapsedTime();
    const delta = newCurrent - this._props.current;
    const elapsed = newCurrent - this._props.start;
    this._props.current = newCurrent;

    Store.time.update({ delta, elapsed });

    this._props.animationHandle = window.requestAnimationFrame(this.tick);
  };
}
