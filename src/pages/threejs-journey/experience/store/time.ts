import StateInstance from '../helpers/state-instance';

interface State {
  beforeFrame: boolean;
  delta: number;
  elapsed: number;
  afterFrame: boolean;
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
