import gsap from 'gsap';
import { atom } from 'jotai/vanilla';
import { Scene, WebGLRenderer } from 'three';

import { type Store, subscribe, unsub } from '../jotai';
import { atomWithCamera } from './atomWithCamera';
import { atomWithViewport, type ViewportOptions } from './atomWithViewport';
import { atomWithViews } from './atomWithViews';

export type ThreeState = ReturnType<typeof atomWithThree>;

export type ThreeOptions = ViewportOptions;

/**
 * Full experience atom with Three.js. Initializes various atoms to manage the
 * scene, camera, controls, renderer, and staging state.
 * @param selector CSS selector for the viewport container
 * @param store Jotai store
 */
export function atomWithThree(
  selector: string,
  store: Store,
  options?: ThreeOptions
) {
  const _canvas = document.createElement('canvas');
  _canvas.classList.add('webgl');

  // Camera
  const { camera, controls } = atomWithCamera(store, _canvas);

  // Renderer
  const renderer = new WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: true,
    canvas: _canvas,
  });

  // Scene
  const scene = new Scene();

  // Viewport
  const viewport = atomWithViewport(store, selector, options);

  const views = atomWithViews(store);

  // Helpers
  const updateSizes = () => {
    const { width, height, aspectRatio, pixelRatio } = store.get(
      viewport._atom
    );
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
  };

  const updateScene = () => {
    if (controls.enableDamping || controls.autoRotate) {
      controls.update();
    }
    renderer.render(scene, camera);
  };

  // Three
  const _root = viewport.root;
  const _threeAtom = atom(null);

  // Init
  _threeAtom.onMount = () => {
    _root.appendChild(_canvas);
    const unsubVp = viewport.sub(updateSizes, {
      callImmediately: true,
    });
    const unsubTime = gsap.ticker.add(updateScene);
    return () => {
      _root.removeChild(_canvas);
      controls.dispose();
      renderer.dispose();
      unsubTime();
      unsubVp();
    };
  };

  return {
    camera,
    controls,
    renderer,
    scene,
    viewport,
    views,
    /**
     * Initialize the Three.js experience. Call the returned function to
     * unmount the experience.
     */
    mount() {
      return subscribe(store, _threeAtom, () => {});
    },
    /**
     * Unsubscribe a namespaced view from all listeners.
     * @param namespace namespace of the experience
     */
    unsub(namespace: string) {
      unsub(store, namespace);
    },
  };
}
