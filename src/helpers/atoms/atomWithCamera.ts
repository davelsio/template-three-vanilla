import { atom } from 'jotai';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

export function atomWithCamera(domElement: HTMLElement) {
  const camera = new PerspectiveCamera();
  const controls = new OrbitControls(camera, domElement);
  controls.enabled = true;
  controls.enableDamping = true;

  const cameraAtom = atom({
    camera,
    controls,
  });

  return cameraAtom;
}
