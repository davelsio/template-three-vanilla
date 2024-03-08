import { Bindable, BindingParams, FolderParams } from '@tweakpane/core';

/**
 * Binding panels configuration object.
 */
export type BindingConfig<T extends Bindable = Bindable> = {
  folder?: FolderParams;
  bindings: Array<{
    key: keyof T;
    options?: CustomBindingParams<T>;
  }>;
};

type CustomBindingParams<T extends Bindable> = BindingParams & {
  condition?: keyof T;
};

/**
 * Debug variables.
 */
export type DebugSettings = typeof debugSettings;
export type DebugConfig = BindingConfig<DebugSettings>;

export const debugSettings = {};

export const debugConfig: DebugConfig[] = [];
