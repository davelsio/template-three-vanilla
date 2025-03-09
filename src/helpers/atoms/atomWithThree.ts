import { atom } from 'jotai/vanilla';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import { atomWithTime, atomWithViewport } from '@helpers/atoms';
import type { Store } from '@helpers/three';

export type AtomWithThree = ReturnType<typeof atomWithThree>;

/**
 * Full experience atom with Three.js. Initializes various atoms to manage the
 * scene, camera, controls, renderer, and staging state.
 * @param selector CSS selector for the viewport container
 * @param store Jotai store
 */
export function atomWithThree(selector: string, store: Store) {
  const timeAtom = atomWithTime();
  const vpAtom = atomWithViewport(selector, store);

  const canvas = document.createElement('canvas');
  canvas.classList.add('webgl');

  const scene = new Scene();

  // Camera
  const camera = new PerspectiveCamera();
  const controls = new OrbitControls(camera, canvas);
  controls.enabled = true;
  controls.enableDamping = true;

  // Renderer
  const renderer = new WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: true,
    canvas,
  });

  // Helpers
  const updateControls = () => {
    if (controls.enableDamping || controls.autoRotate) {
      controls.update();
    }
  };

  const updateSizes = () => {
    const { width, height, aspectRatio, pixelRatio } = store.get(vpAtom);
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
  };

  // Three
  const root = store.get(vpAtom).root;
  const threeAtom = atom({
    canvas,
    camera,
    controls,
    renderer,
    scene,
  });

  // Init
  threeAtom.onMount = () => {
    root.appendChild(canvas);

    const unsubVp = store.sub(vpAtom, updateSizes);
    updateSizes();

    const unsubTime = store.sub(timeAtom, () => {
      updateControls();
      renderer.render(scene, camera);
    });
    updateControls();

    return () => {
      controls.dispose();
      renderer.dispose();
      unsubTime();
      unsubVp();
    };
  };

  const three = {
    get atom() {
      return threeAtom;
    },
    get camera() {
      return store.get(threeAtom).camera;
    },
    get controls() {
      return store.get(threeAtom).controls;
    },
    get renderer() {
      return store.get(threeAtom).renderer;
    },
    get scene() {
      return store.get(threeAtom).scene;
    },
  };

  const viewport = {
    get atom() {
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
    get atom() {
      return timeAtom;
    },
  };

  return {
    three,
    viewport,
    time,
  };
}
