import gsap from 'gsap';
import { atom } from 'jotai/vanilla';
import { Scene, WebGLRenderer } from 'three';

import {
  type Store,
  subscribe,
  type SubscribeToAtomArgs,
  unsub,
} from '../jotai';
import { WebGLView } from '../three';
import { atomWithCamera } from './atomWithCamera';
import { atomWithViewport, type ViewportAtomValue } from './atomWithViewport';
import { atomWithViews, type ViewsAtomValue } from './atomWithViews';

export type ThreeState = ReturnType<typeof atomWithThree>;

/**
 * Full experience atom with Three.js. Initializes various atoms to manage the
 * scene, camera, controls, renderer, and staging state.
 * @param selector CSS selector for the viewport container
 * @param store Jotai store
 */
export function atomWithThree(selector: string, store: Store) {
  const _canvas = document.createElement('canvas');
  _canvas.classList.add('webgl');

  // Camera
  const cameraAtom = atomWithCamera(_canvas);
  const { camera: _camera, controls: _controls } = store.get(cameraAtom);

  // Renderer
  const _renderer = new WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: true,
    canvas: _canvas,
  });

  // Scene
  const _scene = new Scene();

  // Viewport
  const vpAtom = atomWithViewport(selector);

  const viewsAtom = atomWithViews();

  // Helpers
  const updateSizes = () => {
    const { width, height, aspectRatio, pixelRatio } = store.get(vpAtom);
    _camera.aspect = aspectRatio;
    _camera.updateProjectionMatrix();
    _renderer.setSize(width, height);
    _renderer.setPixelRatio(pixelRatio);
  };

  const updateScene = () => {
    if (_controls.enableDamping || _controls.autoRotate) {
      _controls.update();
    }
    _renderer.render(_scene, _camera);
  };

  // Three
  const root = store.get(vpAtom).root;
  const threeAtom = atom(null);

  // Init
  threeAtom.onMount = () => {
    root.appendChild(_canvas);
    const unsubVp = subscribe(store, vpAtom, updateSizes, {
      callImmediately: true,
    });
    const unsubTime = gsap.ticker.add(updateScene);
    return () => {
      root.removeChild(_canvas);
      _controls.dispose();
      _renderer.dispose();
      unsubTime();
      unsubVp();
    };
  };

  return {
    // Objects
    get camera() {
      return store.get(cameraAtom).camera;
    },
    get controls() {
      return store.get(cameraAtom).controls;
    },
    renderer: _renderer,
    scene: _scene,
    viewport: {
      get _atom() {
        return vpAtom;
      },
      get width() {
        return store.get(vpAtom).width;
      },
      get height() {
        return store.get(vpAtom).height;
      },
      get aspectRatio() {
        return store.get(vpAtom).aspectRatio;
      },
      get pixelRatio() {
        return store.get(vpAtom).pixelRatio;
      },
      sub(...args: SubscribeToAtomArgs<ViewportAtomValue, void>) {
        return subscribe(store, vpAtom, ...args);
      },
    },
    three: {
      mount() {
        return subscribe(store, threeAtom, () => {});
      },
    },
    views: {
      get _atom() {
        return viewsAtom;
      },
      get(view: string) {
        return store.get(viewsAtom).find((v) => v.name === view);
      },
      add(view: WebGLView) {
        store.set(viewsAtom, (views) => [
          ...views,
          { name: view.namespace, loaded: view.props.isLoaded },
        ]);
      },
      remove(name: string) {
        store.set(viewsAtom, (views) =>
          views.filter((view) => view.name !== name)
        );
      },
      setLoaded(name: string) {
        store.set(viewsAtom, (views) =>
          views.map((view) =>
            view.name === name ? { ...view, loaded: true } : view
          )
        );
      },
      sub(...args: SubscribeToAtomArgs<ViewsAtomValue, void>) {
        return subscribe(store, viewsAtom, ...args);
      },
    },
    // Methods
    unsub(namespace: string) {
      unsub(store, namespace);
    },
  };
}
