import {
  Bindable,
  BindingParams,
  BladeApi,
  BladeController,
  FolderParams,
  TpChangeEvent,
  View,
} from '@tweakpane/core';
import { BindingApi } from '@tweakpane/core/src/blade/binding/api/binding';

/* INPUT TYPES */
export type ColorRGBA = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type FolderArgs = FolderParams;
export type InputChangeEvent<T> = TpChangeEvent<
  T,
  BladeApi<BladeController<View>>
>;
export type BindingItem = {
  object: Bindable;
  key: keyof Bindable;
  options?: BindingParams;
  onChange?: Parameters<BindingApi<unknown, Bindable[keyof Bindable]>['on']>[1];
};
export type BindingConfig = {
  bindings: BindingItem[];
  folder?: FolderParams;
};

export type BaseOnChange = (
  ev: TpChangeEvent<unknown, BladeApi<BladeController<View>>>
) => void;
