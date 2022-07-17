import { BehaviorSubject, Subscription } from 'rxjs';

interface StageOptions {
  canvas?: HTMLCanvasElement;
  app?: HTMLDivElement;
}

export class StageController {
  private static _state = new BehaviorSubject({
    width: 0,
    height: 0,
    aspectRatio: 0,
    pixelRatio: 1,
  });
  private static _subscriptions: Subscription[] = [];

  public static app: HTMLDivElement;
  public static canvas: HTMLCanvasElement;
  public static root: HTMLElement;

  public static get state() {
    return {
      ...this._state.getValue(),
      subscribe: this._state.subscribe.bind(this._state),
    };
  }

  public static init(root: HTMLElement, options?: StageOptions) {
    this.root = root;

    // Create a canvas element to render the scene
    this.canvas = options?.canvas ?? document.createElement('canvas');
    if (!options?.canvas) {
      this.canvas.classList.add('webgl');
      this.root.appendChild(this.canvas);
    }

    // Update the controller state
    this.updateSize();
    window.addEventListener('resize', this.updateSize);
  }

  public static destroy() {
    window.removeEventListener('resize', this.updateSize);
    this._subscriptions.forEach((sub) => sub.unsubscribe());
    this._state.complete();
  }

  /*  CALLBACKS */

  private static updateSize = () => {
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;
    const aspectRatio = width / height;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    this._state.next({
      width,
      height,
      aspectRatio,
      pixelRatio,
    });
  };
}
