import { atom } from 'jotai/vanilla';
import { Scene, WebGLRenderer } from 'three';

import { type Store, subscribe } from '../jotai';
import { atomWithCamera } from './atomWithCamera';
import { atomWithTime } from './atomWithTime';
import { atomWithViewport } from './atomWithViewport';

export type AtomWithThree = ReturnType<typeof atomWithThree>;

/**
 * Full experience atom with Three.js. Initializes various atoms to manage the
 * scene, camera, controls, renderer, and staging state.
 * @param selector CSS selector for the viewport container
 * @param store Jotai store
 */
export function atomWithThree(selector: string, store: Store) {
  const canvas = document.createElement('canvas');
  canvas.classList.add('webgl');

  // Camera
  const {
    camera: _camera,
    controls: _controls,
    _atom: _cameraAtom,
  } = atomWithCamera(canvas, store);

  // Renderer
  const renderer = new WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: true,
    canvas,
  });

  // Scene
  const scene = new Scene();

  // Time
  const timeAtom = atomWithTime();

  // Viewport
  const vpAtom = atomWithViewport(selector, store);

  // Helpers
  const updateSizes = () => {
    const { width, height, aspectRatio, pixelRatio } = store.get(vpAtom);
    _camera.aspect = aspectRatio;
    _camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
  };

  const updateScene = () => {
    if (_controls.enableDamping || _controls.autoRotate) {
      _controls.update();
    }
    renderer.render(scene, _camera);
  };

  // Three
  const root = store.get(vpAtom).root;
  const threeAtom = atom({
    canvas,
    camera: _camera,
    controls: _controls,
    renderer,
    scene,
  });

  // Init
  threeAtom.onMount = () => {
    root.appendChild(canvas);
    const unsubVp = subscribe(store, vpAtom, updateSizes, true);
    const unsubTime = subscribe(store, timeAtom, updateScene);
    return () => {
      root.removeChild(canvas);
      _controls.dispose();
      renderer.dispose();
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
      return _cameraAtom;
    },
    get camera() {
      return store.get(_cameraAtom).camera;
    },
    get controls() {
      return store.get(_cameraAtom).controls;
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
