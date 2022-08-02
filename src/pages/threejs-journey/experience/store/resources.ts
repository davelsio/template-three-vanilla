import { subscribeWithSelector } from 'zustand/middleware';
import createStore from 'zustand/vanilla';

interface StateProps {
  /**
   * Number of assets already loaded.
   */
  assetsLoaded: number;

  /**
   * Total number assets available in the sources pack.
   */
  assetsTotal: number;

  /**
   * Progress ([0,1]) of the asset loading process.
   */
  assetsProgress: number;
}

interface StateActions {
  /**
   * Update the number of loaded assets.
   * @param loaded number of assets loaded
   */
  updateAssets: (loaded: number) => void;
}

type State = StateProps & StateActions;

const resourceStore = createStore(
  subscribeWithSelector<State>((set, get) => ({
    assetsLoaded: 0,
    assetsTotal: 0,
    assetsProgress: 0,

    updateAssets: (loaded) =>
      set({
        assetsLoaded: loaded,
        assetsProgress: loaded / get().assetsTotal,
      }),
  }))
);

export default {
  get state() {
    return resourceStore.getState();
  },
  update: resourceStore.setState,
  subscribe: resourceStore.subscribe,
};
