import { createStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * API to access the component state.
 */
interface StateProps {
  viewsLoaded: string[];
  viewsProgress: number;
  viewsReady: boolean;
  loadingReady: boolean;
}

/**
 * API to mutate with the controller state.
 */
interface StateActions {
  /**
   * Set a WebGL view as loaded.
   * @param name namespace of the loaded view
   */
  addViewLoaded: (name: string) => void;

  /**
   * Set the loading view and animation as completed.
   */
  setLoadingReady: () => void;

  /**
   * Update progress
   * @param progress unit percent of views loaded
   */
  updateProgress: (progress: number) => void;
}

type State = StateProps & StateActions;

const defaultState = {
  viewsLoaded: [],
  viewsProgress: 0,
  viewsReady: false,
  loadingReady: false,
};

const worldStore = createStore(
  subscribeWithSelector<State>((set) => ({
    ...defaultState,

    addViewLoaded: (name) => {
      set((state) => ({
        viewsLoaded: [...state.viewsLoaded, name],
      }));
    },

    setLoadingReady: () => {
      set({ loadingReady: true });
    },

    updateProgress: (viewsProgress) =>
      set({
        viewsProgress,
        viewsReady: viewsProgress === 1,
      }),
  }))
);

export default {
  ...worldStore.getState(),
  subscribe: worldStore.subscribe,
  destroy: () => {
    worldStore.destroy();
    worldStore.setState(defaultState);
  },
};
