import { BindingParams, BindingTarget, TpPluginBundle } from '@tweakpane/core';

import { ColorNumberInputPlugin } from './color/ColorNumberInputPlugin';
import { ColorObjectInputPlugin } from './color/ColorObjectInputPlugin';
import { NumberInputStatePlugin } from './number/NumberInputStatePlugin';
import { NumberMonitorPlugin } from './number/NumberMonitorStatePlugin';

export const NumberStateBundle: TpPluginBundle = {
  id: 'state-compatibility',
  plugins: [
    ColorNumberInputPlugin,
    ColorObjectInputPlugin,
    NumberInputStatePlugin,
    NumberMonitorPlugin,
  ],
};

/**
 * Flexible parameters to allow the `readonly` states of both monitor (true)
 * and input (true) bindings.
 */
export type BaseParams = BindingParams &
  Record<string, unknown> & {
    readonly?: boolean;
  };

/**
 * Binding arguments for the default reader and writer bindings.
 */
export interface BindingArguments<T, P extends BaseParams> {
  initialValue: T;
  params: P;
  target: BindingTarget;
}

/**
 * Extended binding params with custom reader and writer bindings.
 */
export type WithStateParams<T> =
  T extends BindingArguments<infer V, infer P>
    ? T & {
        params: P & {
          _reader: (key: string) => V;
          _writer: (state: { [key: string]: V }) => void;
        };
      }
    : never;
