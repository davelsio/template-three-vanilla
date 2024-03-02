import { Store } from '../store';

export class StageController {
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
    this.root = root;
    let _canvas: HTMLCanvasElement | undefined = canvas;

    if (!_canvas) {
      _canvas = document.createElement('canvas');
      _canvas.classList.add('webgl');
      this.root.appendChild(_canvas);
    }

    this.canvas = _canvas;

    // Update the controller state
    this.updateStage();
    this.updatePixelRatio();
    window.addEventListener('resize', this.updateStage);
  }

  public destroy() {
    window.removeEventListener('resize', this.updateStage);
    this._media?.removeEventListener('change', this.updatePixelRatio);
  }

  /*  CALLBACKS */

  private updatePixelRatio() {
    const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
    const media = matchMedia(mqString);
    Store.stage.update({ pixelRatio: Math.min(window.devicePixelRatio, 2) });
    media.addEventListener('change', this.updatePixelRatio, { once: true });
    this._media = media;
  }

  private updateStage = () => {
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;

    Store.stage.update({
      width,
      height,
      aspectRatio: width / height,
    });
  };
}
