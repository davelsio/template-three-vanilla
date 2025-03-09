import { createStore as JotaiCreateStore } from 'jotai';

import { atomWithThree } from '../atoms';

export type State = ReturnType<typeof createThreeState>;
export type Store = ReturnType<typeof JotaiCreateStore>;

export function createThreeState() {
  const store = JotaiCreateStore();

  const {
    three, // camera, controls, renderer, scene, stage
    viewport, // viewport
    time, // time
  } = atomWithThree('#root', store);

  return {
    store,
    three,
    viewport,
    time,
  };
}
