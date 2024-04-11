import { atom } from 'jotai/vanilla';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

import { atomWithTime } from '@atoms/atomWithTime';
import { atomWithViewport } from '@atoms/atomWithViewport';
import { appStore } from '@state/store';

export type AtomWithThree = ReturnType<typeof atomWithThree>;

/**
 * Full experience atom with Three.js. Initializes various atoms to manage the
 * scene, camera, controls, renderer, and staging state.
 * @param selector CSS selector for the viewport container
 */
export function atomWithThree(selector: string) {
  const timeAtom = atomWithTime();
  const vpAtom = atomWithViewport(selector);

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
    const { width, height, aspectRatio, pixelRatio } = appStore.get(vpAtom);
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
  };

  // Three
  const root = appStore.get(vpAtom).root;
  const threeAtom = atom({
    root,
    canvas,
    camera,
    controls,
    renderer,
    scene,
  });

  // Init
  threeAtom.onMount = () => {
    root.appendChild(canvas);

    const unsubVp = appStore.sub(vpAtom, () => {
      updateSizes();
    });
    updateSizes();

    const unsubTime = appStore.sub(timeAtom, () => {
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

  return [threeAtom, vpAtom, timeAtom] as const;
}
