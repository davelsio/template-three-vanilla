import { BindingConfig } from '@controllers/Debug';
import { StoreInstance } from '@helpers/StoreInstance';

interface DebugState {
  /**
   * Whether debug mode is enabled or not.
   */
  enabled: boolean;
  /**
   * Currently active input configuration of panels.
   */
  panels: BindingConfig[];
}

export default class DebugStore extends StoreInstance<DebugState> {
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
