import { atomWithThree } from '@atoms/atomWithThree';

export const [
  threeAtom, // camera, controls, renderer, scene, stage
  vpAtom, // viewport
  timeAtom, // time
] = atomWithThree('#root');
