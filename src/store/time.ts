import StateInstance from '../helpers/state-instance';

interface State {
  /**
   * Time elapsed in milliseconds since the previous frame.
   */
  delta: number;
  /**
   * Time elapsed in milliseconds since the clock started.
   */
  elapsed: number;
}

export default class TimeState extends StateInstance<State> {
  constructor() {
    super({
      delta: 16,
      elapsed: 0,
    });
  }

  public update(state: Partial<State>) {
    this._state.setState(state);
  }
}
