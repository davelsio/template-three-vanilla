import { StoreInstance } from '@helpers/classes/StoreInstance';
import { DebugSettings, debugSettings } from '@settings/debug';

export interface DebugState extends DebugSettings {
  /**
   * Debug mode enabled.
   */
  enabled: boolean;
  /**
   * Start with the debug panel expanded.
   */
  expanded: boolean;
}

export class DebugStore extends StoreInstance<DebugState> {
  constructor() {
    super('DebugStore', {
      enabled: false,
      expanded: true,
      ...debugSettings,
    });
  }

  /* PUBLIC API */

  /**
   * Enable debug mode.
   */
  public enableDebug() {
    this._state.setState({ enabled: true });
  }
}
