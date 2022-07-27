import { createStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface StateProps {
  beforeFrame: boolean;
  delta: number;
  elapsed: number;
  afterFrame: boolean;
}

interface StateActions {
  update: (state: Partial<StateProps>) => void;
}

type State = StateProps & StateActions;

const timeStore = createStore(
  subscribeWithSelector<State>((set) => ({
    beforeFrame: false,
    delta: 16,
    elapsed: 0,
    afterFrame: false,

    update: set,
  }))
);

export default {
  get state() {
    return timeStore.getState();
  },
  subscribe: timeStore.subscribe,
};
