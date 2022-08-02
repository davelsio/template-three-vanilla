import StateInstance from '../helpers/state-instance';
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
}

export default class DebugState extends StateInstance<State> {
  constructor() {
    super({
      enabled: false,
      panels: [],
    });
  }

  /**
   * Add a new input configuration to the debug panel.
   * @param args inputs and optional folder config
   */
  public addConfig(inputConfig: InputConfig) {
    this._state.setState((state) => ({
      panels: [...state.panels, inputConfig],
    }));
  }

  /**
   * Enable debug mode.
   */
  public enableDebug() {
    this._state.setState({ enabled: true });
  }
}
