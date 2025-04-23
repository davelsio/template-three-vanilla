import { atom } from 'jotai';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

import { Store } from '../jotai';

export function atomWithCamera(store: Store, domElement: HTMLElement) {
  const camera = new PerspectiveCamera();
  const controls = new OrbitControls(camera, domElement);
  controls.enabled = true;
  controls.enableDamping = true;

  const cameraAtom = atom({
    camera,
    controls,
  });

  return {
    _atom: cameraAtom,
    get camera() {
      return store.get(cameraAtom).camera;
    },
    get controls() {
      return store.get(cameraAtom).controls;
    },
  };
}
