import StateInstance from '../helpers/state-instance';
import { BindingConfig } from '../types/debug';

interface State {
  /**
   * Whether debug mode is enabled or not.
   */
  enabled: boolean;

  /**
   * Currently active input configuration of panels.
   */
  panels: BindingConfig[];
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
   * @param bindingConfig bindings and optional folder config
   */
  public addConfig(bindingConfig: BindingConfig) {
    this._state.setState((state) => ({
      panels: [...state.panels, bindingConfig],
    }));
  }

  /**
   * Enable debug mode.
   */
  public enableDebug() {
    this._state.setState({ enabled: true });
  }
}
