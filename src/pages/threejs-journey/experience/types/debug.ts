import {
  Bindable,
  FolderParams,
  InputParams,
  TpChangeEvent,
} from '@tweakpane/core';

/* INPUT TYPES */
export type ColorRGBA = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type FolderArgs = FolderParams;
export type InputChangeEvent = TpChangeEvent<any>;
export type InputItem = {
  object: Bindable;
  key: string;
  options?: InputParams;
  onChange?: (event: InputChangeEvent) => void;
};
export type InputConfig = {
  inputs: InputItem[];
  folder?: FolderParams;
};
