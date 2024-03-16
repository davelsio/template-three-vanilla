import { Vector2 } from 'three';

import { BaseController } from '@helpers/classes/BaseController';
import { Store } from '@state/Store';

export class StageController extends BaseController {
  private _media: MediaQueryList | undefined;

  public root: HTMLDivElement;
  public canvas: HTMLCanvasElement;

  public get width() {
    return Store.stage.state.width;
  }

  public get height() {
    return Store.stage.state.height;
  }

  public get aspectRatio() {
    return Store.stage.state.aspectRatio;
  }

  public get pixelRatio() {
    return Store.stage.state.pixelRatio;
  }

  public constructor(root: HTMLDivElement, canvas?: HTMLCanvasElement) {
    super('StageController');

    this.root = root;
    let _canvas: HTMLCanvasElement | undefined = canvas;

    if (!_canvas) {
      _canvas = document.createElement('canvas');
      _canvas.classList.add('webgl');
      this.root.appendChild(_canvas);
    }

    this.canvas = _canvas;

    // Initialize the store state
    Store.stage.update({ root: this.root, canvas: this.canvas });
    this.updateDimensions();
    this.updatePixelRatio();
    window.addEventListener('resize', this.updateDimensions);
  }

  public destroy = () => {
    window.removeEventListener('pointermove', this.updateCursorPosition);
    window.removeEventListener('resize', this.updateDimensions);
    this._media?.removeEventListener('change', this.updatePixelRatio);
    Store.stage.destroy();
  };

  /*  CALLBACKS */

  private updateCursorPosition = (event: PointerEvent) => {
    // Convert to clip space [-1, 1]
    const x = (event.clientX / this.width) * 2 - 1; // left to right
    const y = -(event.clientY / this.height) * 2 + 1; // bottom to top
    Store.stage.update({ cursorPosition: new Vector2(x, y) });
  };

  private updateDimensions = () => {
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;
    Store.stage.update({
      width,
      height,
      aspectRatio: width / height,
    });
  };

  private updatePixelRatio = () => {
    Store.stage.update({ pixelRatio: Math.min(window.devicePixelRatio, 2) });
    const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
    this._media = window.matchMedia(mqString);
    this._media.addEventListener('change', this.updatePixelRatio, {
      once: true,
    });
  };
}
