import { atom } from 'jotai/vanilla';
import { Scene, WebGLRenderer } from 'three';

import { type Store, subscribe } from '../jotai';
import { atomWithCamera } from './atomWithCamera';
import { atomWithTime } from './atomWithTime';
import { atomWithViewport } from './atomWithViewport';

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

  // Time
  const timeAtom = atomWithTime();

  // Viewport
  const vpAtom = atomWithViewport(selector, store);

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
  const threeAtom = atom({
    canvas: _canvas,
    renderer: _renderer,
    scene: _scene,
  });

  // Init
  threeAtom.onMount = () => {
    root.appendChild(_canvas);
    const unsubVp = subscribe(store, vpAtom, updateSizes, true);
    const unsubTime = subscribe(store, timeAtom, updateScene);
    return () => {
      root.removeChild(_canvas);
      _controls.dispose();
      _renderer.dispose();
      unsubTime();
      unsubVp();
    };
  };

  const three = {
    get _atom() {
      return threeAtom;
    },
    get renderer() {
      return store.get(threeAtom).renderer;
    },
    get scene() {
      return store.get(threeAtom).scene;
    },
  };

  const camera = {
    get _atom() {
      return cameraAtom;
    },
    get camera() {
      return store.get(cameraAtom).camera;
    },
    get controls() {
      return store.get(cameraAtom).controls;
    },
  };

  const viewport = {
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
  };

  const time = {
    get _atom() {
      return timeAtom;
    },
  };

  return {
    three,
    camera,
    viewport,
    time,
  };
}
