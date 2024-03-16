import { Vector2 } from 'three';

import { StoreInstance } from '@helpers/classes/StoreInstance';

export interface StageState {
  /**
   * Ratio of `width / height` of the root element.
   */
  aspectRatio: number;
  /**
   * WebGL canvas where the experience is rendered.
   */
  canvas?: HTMLCanvasElement;
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
   * Parent DOM element of the WebGL canvas.
   */
  root?: HTMLDivElement;
  /**
   * Width of the root element in `px`.
   */
  width: number;
}

export class StageStore extends StoreInstance<StageState> {
  public get canvas() {
    if (!this.state.canvas) {
      throw new Error('WebGL canvas not found.');
    }
    return this.state.canvas;
  }

  public get root() {
    if (!this.state.root) {
      throw new Error('WebGL root element not found.');
    }
    return this.state.root;
  }

  constructor() {
    super({
      width: 0,
      height: 0,
      aspectRatio: 0,
      pixelRatio: 1,
      cursorPosition: new Vector2(9999, 9999), // start off-screen
    });
  }
}
