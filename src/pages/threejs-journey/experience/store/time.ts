import StateInstance from '../helpers/state-instance';

interface State {
  /**
   * Whether the current state is immediately after a frame event.
   */
  afterFrame: boolean;

  /**
   * Whether the current state is immediately before a frame event.
   */
  beforeFrame: boolean;

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
      beforeFrame: false,
      delta: 16,
      elapsed: 0,
      afterFrame: false,
    });
  }

  public update(state: Partial<State>) {
    this._state.setState(state);
  }
}
