import { subscribeWithSelector } from 'zustand/middleware';
import createStore from 'zustand/vanilla';

import { InputConfig } from '../types/debug';

interface State {
  /**
   * Whether debug mode is enabled or not.
   */
  enabled: boolean;

  /**
   * Currently active input configuration of panels.
   */
  panels: InputConfig[];

  /**
   * Add a new input configuration to the debug panel.
   * @param args inputs and optional folder config
   */
  addConfig: (args: InputConfig) => void;

  /**
   * Enable debug mode.
   */
  enableDebug: () => void;
}

const debugStore = createStore(
  subscribeWithSelector<State>((set) => ({
    enabled: false,
    panels: [],

    addConfig: (inputConfig) =>
      set((state) => ({
        panels: [...state.panels, inputConfig],
      })),

    enableDebug: () => set({ enabled: true }),
  }))
);

export default {
  ...debugStore.getState(),
  subscribe: debugStore.subscribe,
};
