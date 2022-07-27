import { createStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface StateProps {
  width: number;
  height: number;
  aspectRatio: number;
  pixelRatio: number;
}

interface StateActions {
  update: (state: Partial<StateProps>) => void;
}

type State = StateProps & StateActions;

const stageStore = createStore(
  subscribeWithSelector<State>((set) => ({
    width: 0,
    height: 0,
    aspectRatio: 0,
    pixelRatio: 1,

    update: (state: Partial<StateProps>) => set({ ...state }),
  }))
);

export default {
  get state() {
    return stageStore.getState();
  },
  subscribe: stageStore.subscribe,
};
