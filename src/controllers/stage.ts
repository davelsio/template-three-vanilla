import { Store } from '../store';

export class StageController {
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
    window.addEventListener('resize', this.updateStage);
  }

  public destroy() {
    window.removeEventListener('resize', this.updateStage);
  }

  /*  CALLBACKS */

  private updateStage = () => {
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;

    Store.stage.update({
      width,
      height,
      aspectRatio: width / height,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    });
  };
}
