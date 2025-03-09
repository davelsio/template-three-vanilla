import { createStore } from 'jotai';

import { atomWithThree } from '../atoms';

export type State = ReturnType<typeof createThreeState>;

export function createThreeState() {
  const store = createStore();
  return {
    store,
    ...atomWithThree('#root', store),
  };
}
