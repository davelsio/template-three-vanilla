import { StoreInstance } from '@helpers/StoreInstance';

export interface StageState {
  /**
   * Ratio of `width / height` of the root element.
   */
  aspectRatio: number;
  /**
   * Height of the root element in `px`.
   */
  height: number;
  /**
   * Device pixel ratio, up to a maximum of 2.
   */
  pixelRatio: number;
  /**
   * Width of the root element in `px`.
   */
  width: number;
}

export class StageStore extends StoreInstance<StageState> {
  constructor() {
    super({
      width: 0,
      height: 0,
      aspectRatio: 0,
      pixelRatio: 1,
    });
  }

  public update(state: Partial<StageState>) {
    this._state.setState({ ...state });
  }
}
