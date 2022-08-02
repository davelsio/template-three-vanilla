import { Camera, Color, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import { TpChangeEvent } from 'tweakpane';

import { stageStore, Store, subscriptions, timeStore } from '../store';
import { ColorRGBA } from '../types/debug';

interface Options {
  clearColor: number;
}

export class RenderController {
  private _camera: Camera;
  private _scene: Scene;
  private _options: Options = {
    clearColor: 0x201919,
  };

  public namespace = 'RenderController';
  public renderer: WebGLRenderer;

  public constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    camera: Camera,
    scene: Scene,
    options?: Partial<Options>
  ) {
    this._camera = camera;
    this._scene = scene;

    if (options) Object.assign(this._options, options);

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      powerPreference: 'high-performance',
      antialias: true,
    });
    this.renderer.outputEncoding = sRGBEncoding;

    this.renderer.setClearColor(this._options.clearColor);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1);

    this.setupSubscriptions();
  }

  public destroy() {
    subscriptions[this.namespace].forEach((unsub) => unsub());
    this.renderer.dispose();
  }

  /* SETUP */

  private setupSubscriptions() {
    Store.debug.subscribe((state) => state.enabled, this.debug, {
      fireImmediately: true,
      namespace: this.namespace,
    });

    subscriptions[this.namespace].push(
      timeStore.subscribe((state) => state.elapsed, this.update),

      stageStore.subscribe(
        (state) => [state.width, state.height, state.pixelRatio],
        ([width, height, pixelRatio]) => this.resize(width, height, pixelRatio)
      )
    );
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
      inputs: [
        {
          object,
          key: 'clearColor',
          options: {
            color: { type: 'float' },
          },
          onChange: (event: TpChangeEvent<ColorRGBA>) => {
            if (event.presetKey === 'clearColor') {
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
    this.renderer.render(this._scene, this._camera);
  };
}
