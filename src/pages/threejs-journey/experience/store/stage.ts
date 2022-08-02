import StateInstance from '../helpers/state-instance';

interface State {
  width: number;
  height: number;
  aspectRatio: number;
  pixelRatio: number;
}

export default class StageState extends StateInstance<State> {
  constructor() {
    super({
      width: 0,
      height: 0,
      aspectRatio: 0,
      pixelRatio: 1,
    });
  }

  public update(state: Partial<State>) {
    this._state.setState({ ...state });
  }
}
