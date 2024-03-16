import { Vector2 } from 'three';

import { StoreInstance } from '@helpers/classes/StoreInstance';

export interface StageState {
  /**
   * Ratio of `width / height` of the root element.
   */
  aspectRatio: number;
  /**
   * Cursor position in clip space [-1, 1].
   */
  cursorPosition: Vector2;
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
    super('StageStore', {
      width: 0,
      height: 0,
      aspectRatio: 0,
      pixelRatio: 1,
      cursorPosition: new Vector2(9999, 9999), // start off-screen
    });
  }
}
