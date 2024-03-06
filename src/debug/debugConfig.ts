import { Bindable, BindingParams, FolderParams } from '@tweakpane/core';
import { Color, Vector3 } from 'three';

/**
 * Debug variables.
 */
export type DebugObject = typeof debugObject;

const { r, g, b } = new Color(0x000000);
export const debugObject = {
  clearColor: { r, g, b, a: 1.0 },
  cameraPosition: new Vector3(3, 3, 5),
  cameraFov: 40,
  cameraNear: 0.1,
  cameraFar: 100,
  //
  baseSize: 0.75,
  color: new Color(0xffffff),
  //
  poleLightColor: new Color(0xffffff),
  portalColorStart: new Color(0x000000),
  portalColorEnd: new Color(0xffffff),
  uvDisplacementOffset: 5.0,
  uvStrengthOffset: 5.0,
};

/**
 * Binding panels configuration object.
 */
export type BindingConfig<T extends Bindable = Bindable> = {
  folder: FolderParams;
  bindings: Array<{
    key: keyof T;
    options?: BindingParams;
  }>;
};

export const debugConfig: BindingConfig<DebugObject>[] = [
  {
    folder: {
      title: 'Fireflies',
    },
    bindings: [
      {
        key: 'baseSize',
        options: {
          label: 'baseSize',
          min: 0.01,
          max: 2.0,
          step: 0.01,
        },
      },
      {
        key: 'color',
        options: {
          label: 'uColor',
          color: { type: 'float' },
        },
      },
    ],
  },
  {
    folder: {
      title: 'Portal',
    },
    bindings: [
      {
        key: 'portalColorStart',
        options: {
          label: 'uColorStart',
          color: { type: 'float' },
        },
      },
      {
        key: 'portalColorEnd',
        options: {
          label: 'uColorEnd',
          color: { type: 'float' },
        },
      },
      {
        key: 'uvDisplacementOffset',
        options: {
          label: 'uDisplacement',
          min: 0,
          max: 50,
          step: 0.1,
        },
      },
      {
        key: 'uvStrengthOffset',
        options: {
          label: 'uStrength',
          min: 0,
          max: 50,
          step: 0.1,
        },
      },
    ],
  },
  {
    folder: {
      title: 'Environment',
    },
    bindings: [
      {
        key: 'poleLightColor',
        options: {
          label: 'poleLightColor',
          color: { type: 'float' },
        },
      },
    ],
  },
];
