import { Camera, Color, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import { TpChangeEvent } from 'tweakpane';
import createStore from 'zustand/vanilla';

import { Store } from '../store';
import { ColorRGBA } from '../types/debug';
import { Subscription } from '../types/store';

interface StateProps {
  clearColor: ColorRGBA;
}

interface StateActions {
  updateColor: (clearColor: ColorRGBA) => void;
}

type State = StateProps & StateActions;

export class RenderController {
  private static _camera: Camera;
  private static _scene: Scene;
  private static _subscriptions: Subscription[] = [];

  private static _state = createStore<State>((set) => ({
    clearColor: { ...new Color(0x201919), a: 1.0 },
    updateColor: (clearColor: ColorRGBA) => set({ clearColor }),
  }));

  public static renderer: WebGLRenderer;
  public static get state() {
    return {
      ...this._state.getState(),
      subscribe: this._state.subscribe,
    };
  }

  public static init(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    camera: Camera,
    scene: Scene,
    props?: Partial<StateProps>
  ) {
    this._camera = camera;
    this._scene = scene;

    if (props) this._state.setState(props);

    this.renderer = new WebGLRenderer({
      canvas: canvas,
      powerPreference: 'high-performance',
      antialias: true,
    });
    this.renderer.outputEncoding = sRGBEncoding;

    const { r, g, b, a } = this._state.getState().clearColor;
    this.renderer.setClearColor(new Color(r, g, b), a);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1);

    this.setupSubscriptions();
  }

  public static destroy() {
    this._subscriptions.forEach((unsub) => unsub());
    this.renderer.dispose();
  }

  /* SETUP */

  private static setupSubscriptions() {
    const debugSub = Store.debug.subscribe(
      (state) => state.active,
      this.debug,
      { fireImmediately: true }
    );
    this._subscriptions.push(debugSub);

    const frameSub = Store.time.subscribe((state) => {
      if (!state.afterFrame && !state.beforeFrame) this.update();
    });
    this._subscriptions.push(frameSub);

    const renderSub = this._state.subscribe((state) => {
      const { r, g, b, a } = state.clearColor;
      this.renderer.setClearColor(new Color(r, g, b), a);
    });
    this._subscriptions.push(renderSub);

    const resizeSub = Store.stage.subscribe((state) => {
      this.resize(state.width, state.height, state.pixelRatio);
    });
    this._subscriptions.push(resizeSub);
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

    Store.debug.addInputs({
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
