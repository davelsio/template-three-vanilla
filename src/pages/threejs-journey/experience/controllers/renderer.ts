import { Subscription } from 'rxjs';
import { Camera, Color, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import { TpChangeEvent } from 'tweakpane';

import { Store } from '../store';
import { ColorRGBA } from '../types/debug';

interface RendererOptions {
  clearColor?: number;
}

export class RenderController {
  private static _options: Required<RendererOptions> = {
    clearColor: 0x201919,
  };

  private static _camera: Camera;
  private static _scene: Scene;
  private static _subscriptions: Subscription[] = [];

  public static renderer: WebGLRenderer;

  public static init(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    camera: Camera,
    scene: Scene,
    props?: RendererOptions
  ) {
    this._camera = camera;
    this._scene = scene;
    Object.assign(this._options, props);

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
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.renderer.dispose();
  }

  /* SETUP */

  private static setupSubscriptions() {
    const frameSub = Store.time.frame.subscribe(() => {
      this.update();
    });
    this._subscriptions.push(frameSub);

    const resizeSub = Store.stage.subscribe((state) => {
      this.resize(state.width, state.height, state.pixelRatio);
    });
    this._subscriptions.push(resizeSub);

    const debugSubscriber = Store.debug.subscribe((state) => {
      this.debug(state.active);
    });
    this._subscriptions.push(debugSubscriber);
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

    Store.dispatch({
      controller: 'DebugController',
      action: {
        type: 'ADD_INPUT',
        payload: {
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
        },
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
