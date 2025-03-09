import { atom } from 'jotai';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

import type { Store } from '../jotai';

export function atomWithCamera(domElement: HTMLElement, store: Store) {
  const camera = new PerspectiveCamera();
  const controls = new OrbitControls(camera, domElement);
  controls.enabled = true;
  controls.enableDamping = true;

  const cameraAtom = atom({
    camera,
    controls,
  });

  return {
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
}
