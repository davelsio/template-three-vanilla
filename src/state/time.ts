import { StoreInstance } from '@helpers/StoreInstance';

interface TimeState {
  /**
   * Time elapsed in milliseconds since the previous frame.
   */
  delta: number;
  /**
   * Time elapsed in milliseconds since the clock started.
   */
  elapsed: number;
}

export default class TimeStore extends StoreInstance<TimeState> {
  constructor() {
    super({
      delta: 16,
      elapsed: 0,
    });
  }

  public update(state: Partial<TimeState>) {
    this._state.setState(state);
  }
}
