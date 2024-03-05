import { BaseController } from '@helpers/BaseController';
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

    const { r, g, b, a } = Store.debug.state.clearColor;
    this.renderer.setClearColor(new Color(r, g, b), a);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Store.stage.state.pixelRatio);

    this.setupSubscriptions();
  }

  public destroy() {
    Store.unsubscribe(this.namespace);
    this.renderer.dispose();
  }

  /* SETUP */

  private setupSubscriptions() {
    Store.debug.subscribe(
      this.namespace,
      (state) => state.clearColor,
      this.debug
    );

    Store.stage.subscribe(
      this.namespace,
      (state) => [state.width, state.height, state.pixelRatio],
      ([width, height, pixelRatio]) => this.resize(width, height, pixelRatio)
    );

    Store.time.subscribe(this.namespace, (state) => state.elapsed, this.update);
  }

  /* CALLBACKS */

  private debug = ({ r, g, b, a }: ClearColor) => {
    this.renderer.setClearColor(new Color(r, g, b), a);
  };

  private resize = (width: number, height: number, pixelRatio: number) => {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  };

  private update = () => {
    this.renderer.render(this.scene, this._camera);
  };
}
