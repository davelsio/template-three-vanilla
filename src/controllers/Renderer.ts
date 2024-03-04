import { Store } from '@state/Store';
import { Camera, Color, Scene, SRGBColorSpace, WebGLRenderer } from 'three';

interface Options {
  clearColor: number;
}

export class RenderController {
  private _camera: Camera;
  private _options: Options = {
    clearColor: 0x201919,
  };

  public namespace = 'RenderController';
  public renderer: WebGLRenderer;
  public scene: Scene;

  public constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    camera: Camera,
    options?: Partial<Options>
  ) {
    this._camera = camera;
    this.scene = new Scene();

    if (options) Object.assign(this._options, options);

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      powerPreference: 'high-performance',
      antialias: true,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;

    this.renderer.setClearColor(this._options.clearColor);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Store.stage.state.pixelRatio);

    this.setupSubscriptions();
  }

  public destroy() {
    Store.debug.unsubscribe(this.namespace);
    Store.time.unsubscribe(this.namespace);
    Store.world.unsubscribe(this.namespace);
    this.renderer.dispose();
  }

  /* SETUP */

  private setupSubscriptions() {
    Store.debug.subscribe(
      this.namespace,
      (state) => state.enabled,
      this.debug,
      { fireImmediately: true }
    );

    Store.stage.subscribe(
      this.namespace,
      (state) => [state.width, state.height, state.pixelRatio],
      ([width, height, pixelRatio]) => this.resize(width, height, pixelRatio)
    );

    Store.time.subscribe(this.namespace, (state) => state.elapsed, this.update);
  }

  /* CALLBACKS */

  private debug = (active?: boolean) => {
    if (!active) return;

    const clearAlpha = this.renderer.getClearAlpha();
    const clearColor = this.renderer.getClearColor(new Color());

    const object = {
      clearColor: {
        r: clearColor.r,
        g: clearColor.g,
        b: clearColor.b,
        a: clearAlpha,
      },
    };

    Store.debug.addConfig({
      bindings: [
        {
          object,
          key: 'clearColor',
          options: {
            color: { type: 'float' },
          },
          onChange: (event) => {
            if (event.target.key === 'clearColor') {
              this.renderer.setClearColor(
                new Color(event.value.r, event.value.g, event.value.b),
                event.value.a
              );
            }
          },
        },
      ],
      folder: {
        title: 'Renderer',
        index: 1,
      },
    });
  };

  private resize = (width: number, height: number, pixelRatio: number) => {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  };

  private update = () => {
    this.renderer.render(this.scene, this._camera);
  };
}
