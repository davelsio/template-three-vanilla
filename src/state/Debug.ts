import { DebugObject, debugObject } from '@debug/debugConfig';
import { StoreInstance } from '@helpers/StoreInstance';
import { TpChangeEvent } from '@tweakpane/core';
import { BindingApi } from '@tweakpane/core/src/blade/binding/api/binding';
import { Color, Vector2, Vector3 } from 'three';

export interface DebugState extends DebugObject {
  /**
   * Whether debug mode is enabled or not.
   */
  enabled: boolean;
}

export class DebugStore extends StoreInstance<DebugState> {
  constructor() {
    super({
      enabled: false,
      ...debugObject,
    });
  }

  /* PUBLIC API */

  /**
   * Enable debug mode.
   */
  public enableDebug() {
    this._state.setState({ enabled: true });
  }

  public updateBinding = ({
    value,
    target,
  }: TpChangeEvent<DebugState[keyof DebugState], BindingApi>) => {
    const _value = this.getBindingValue(value);
    this._state.setState({ [target.key]: _value });
  };

  /* PRIVATE METHODS */
  private getBindingValue(value: unknown) {
    if (value instanceof Color) return new Color(value);
    if (value instanceof Vector3) return new Vector3(...value.toArray());
    if (value instanceof Vector2) return new Vector2(...value.toArray());
    if (Array.isArray(value)) return [...value];
    if (typeof value === 'object') return { ...value };
    return value;
  }
}
