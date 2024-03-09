import {
  Bindable,
  BindingApi,
  BindingParams,
  BindingTarget,
  InputBindingPlugin,
  MonitorBindingPlugin,
} from '@tweakpane/core';

/**
 * Flexible parameters to allow the `readonly` states of both monitor (true)
 * and input (false) bindings.
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
 * Input binding plugin with custom reader and writer state parameters.
 */
export type InputBindingPluginWithStateParams<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? InputBindingPlugin<In, Ex, WithStateParams<Params>>
    : never;

/**
 * Binding input arguments for the default reader and writer params.
 */
export type InputBindingArgs<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? BindingArguments<Ex, Params>
    : never;

/**
 * Binding monitor arguments for the default reader param.
 */
export type MonitorBindingArgs<T> =
  T extends MonitorBindingPlugin<infer In, infer Params>
    ? BindingArguments<In, Params>
    : never;

/**
 * Binding input arguments with custom writer and reader params.
 */
export type InputBindingArgsWithStateParams<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? WithStateParams<BindingArguments<Ex, Params>>
    : never;

/**
 * Binding monitor arguments with custom reader param.
 */
export type MonitorBindingArgsWithStateParams<T> =
  T extends MonitorBindingPlugin<infer In, infer Params>
    ? WithStateParams<BindingArguments<In, Params>>
    : never;

/**
 * Extend binding type args with params with custom reader and writer params.
 */
export type WithStateParams<T> =
  T extends BindingArguments<infer V, infer P>
    ? T & {
        params: P & StateParams<V>;
      }
    : never;

export type StateParams<V> = {
  reader?: (target: BindingTarget, value: V) => V;
  writer?: (target: BindingTarget, value: V) => void;
};

declare module '@tweakpane/core' {
  interface FolderApi {
    addBinding<T extends Bindable, K extends keyof T>(
      target: T,
      key: K,
      options?: BindingParams & StateParams<K>
    ): BindingApi;
  }
}
