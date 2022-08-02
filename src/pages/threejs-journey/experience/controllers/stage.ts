import { Store } from '../store';

interface StageOptions {
  canvas?: HTMLCanvasElement;
  app?: HTMLDivElement;
}

export class StageController {
  public app: HTMLDivElement;
  public canvas: HTMLCanvasElement;
  public root: HTMLElement;

  public width: number;
  public height: number;
  public aspectRatio: number;
  public pixelRatio: number;

  public constructor(root: HTMLElement, options?: StageOptions) {
    this.root = root;

    // Create a canvas element to render the scene
    this.canvas = options?.canvas ?? document.createElement('canvas');
    if (!options?.canvas) {
      this.canvas.classList.add('webgl');
      this.root.appendChild(this.canvas);
    }

    // Update the controller state
    this.updateStage();
    window.addEventListener('resize', this.updateStage);
  }

  public destroy() {
    window.removeEventListener('resize', this.updateStage);
  }

  /*  CALLBACKS */

  private updateStage = () => {
    this.width = this.root.clientWidth;
    this.height = this.root.clientHeight;
    this.aspectRatio = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    Store.stage.update({
      width: this.width,
      height: this.height,
      aspectRatio: this.aspectRatio,
      pixelRatio: this.pixelRatio,
    });
  };
}
