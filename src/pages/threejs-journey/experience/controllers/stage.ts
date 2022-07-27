import { stageStore } from '../store';
interface StageOptions {
  canvas?: HTMLCanvasElement;
  app?: HTMLDivElement;
}

export class StageController {
  public static app: HTMLDivElement;
  public static canvas: HTMLCanvasElement;
  public static root: HTMLElement;

  public static width: number;
  public static height: number;
  public static aspectRatio: number;
  public static pixelRatio: number;

  public static init(root: HTMLElement, options?: StageOptions) {
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

  public static destroy() {
    window.removeEventListener('resize', this.updateStage);
  }

  /*  CALLBACKS */

  private static updateStage = () => {
    this.width = this.root.clientWidth;
    this.height = this.root.clientHeight;
    this.aspectRatio = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    stageStore.state.update({
      width: this.width,
      height: this.height,
      aspectRatio: this.aspectRatio,
      pixelRatio: this.pixelRatio,
    });
  };
}
