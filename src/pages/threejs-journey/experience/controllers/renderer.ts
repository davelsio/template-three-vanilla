import { Camera, Color, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import { TpChangeEvent } from 'tweakpane';

import { debugStore, stageStore, Store, timeStore } from '../store';
import { ColorRGBA } from '../types/debug';

interface Options {
  clearColor: number;
}

export class RenderController {
  private static _camera: Camera;
  private static _scene: Scene;
  private static _options: Options = {
    clearColor: 0x201919,
  };

  public static namespace = 'RenderController';
  public static renderer: WebGLRenderer;

  public static init(
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

  public static destroy() {
    Store.subscriptions[this.namespace].forEach((unsub) => unsub());
    this.renderer.dispose();
  }

  /* SETUP */

  private static setupSubscriptions() {
    const debugSub = debugStore.subscribe(
      (state) => state.enabled,
      this.debug,
      {
        fireImmediately: true,
      }
    );

    const frameSub = timeStore.subscribe((state) => state.elapsed, this.update);

    const resizeSub = stageStore.subscribe(
      (state) => [state.width, state.height, state.pixelRatio],
      ([width, height, pixelRatio]) => this.resize(width, height, pixelRatio)
    );

    Store.subscriptions[this.namespace].push(debugSub, frameSub, resizeSub);
  }

  /* CALLBACKS */

  private static debug = (active?: boolean) => {
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

    debugStore.addConfig({
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

  private static resize = (
    width: number,
    height: number,
    pixelRatio: number
  ) => {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  };

  private static update = () => {
    this.renderer.render(this._scene, this._camera);
  };
}
