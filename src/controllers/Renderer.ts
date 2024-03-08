import { BaseController } from '@helpers/BaseController';
import { StageState } from '@state/Stage';
import { Store } from '@state/Store';
import { Camera, Color, Scene, SRGBColorSpace, WebGLRenderer } from 'three';

export type ClearColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export class RenderController extends BaseController {
  private _camera: Camera;

  public renderer: WebGLRenderer;
  public scene: Scene;

  public constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    camera: Camera
  ) {
    super('RenderController');

    this._camera = camera;
    this.scene = new Scene();

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      powerPreference: 'high-performance',
      antialias: true,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;

    const { r, g, b, a } = Store.render.state.clearColor;
    this.renderer.setClearColor(new Color(r, g, b), a);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Store.stage.state.pixelRatio);

    Store.render.update({
      /**
       * Max may range from 2 to 16 depending on the device and browser.
       * Clamping it to 8 is probably enough and better for performance.
       */
      anisotropy: Math.max(1, this.renderer.capabilities.getMaxAnisotropy()),
    });
    this.setupSubscriptions();
  }

  public destroy() {
    Store.unsubscribe(this.namespace);
    this.renderer.dispose();
  }

  /* SETUP */

  private setupSubscriptions() {
    const { render, stage, time } = Store.getSubscribers(this.namespace);
    render((state) => state.clearColor, this.debug);
    stage((state) => state, this.resize);
    time((state) => state.elapsed, this.update);
  }

  /* CALLBACKS */

  private debug = ({ r, g, b, a }: ClearColor) => {
    this.renderer.setClearColor(new Color(r, g, b), a);
  };

  private resize = ({ width, height, pixelRatio }: StageState) => {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  };

  private update = () => {
    this.renderer.render(this.scene, this._camera);
  };
}
