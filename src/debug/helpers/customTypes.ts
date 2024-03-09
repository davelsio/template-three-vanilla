import {
  BindingParams,
  BindingTarget,
  InputBindingPlugin,
  MonitorBindingPlugin,
} from '@tweakpane/core';

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
 * Input binding plugin with custom _reader and _writer state parameters.
 */
export type InputBindingPluginWithStateParams<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? InputBindingPlugin<In, Ex, WithStateParams<Params>>
    : never;
/**
 * Binding arguments for the default reader and writer bindings.
 */
export type InputBindingArgs<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? BindingArguments<Ex, Params>
    : never;
/**
 * Binding arguments with custom _writer and _reader params.
 */
export type InputBindingArgsWithStateParams<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? WithStateParams<BindingArguments<Ex, Params>>
    : never;
/**
 * Binding arguments for the default reader binding.
 */
export type MonitorBindingArgs<T> =
  T extends MonitorBindingPlugin<infer In, infer Params>
    ? BindingArguments<In, Params>
    : never;
/**
 * Binding arguments with custom _reader param.
 */
export type MonitorBindingArgsWithStateParams<T> =
  T extends MonitorBindingPlugin<infer In, infer Params>
    ? WithStateParams<BindingArguments<In, Params>>
    : never;
/**
 * Extend binding type args with params with custom _reader and _writer params.
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
