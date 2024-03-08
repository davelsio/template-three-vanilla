import { BindingConfig } from '@controllers/Debug';
import { Color } from 'three';

export type WorldSettings = typeof worldSettings;
export type WorldConfig = BindingConfig<WorldSettings>;

export const worldSettings = {
  // Views
  baseSize: 0.75,
  color: new Color(0xffffff),
  //
  poleLightColor: new Color(0xffffff),
  portalColorStart: new Color(0x000000),
  portalColorEnd: new Color(0xffffff),
  uvDisplacementOffset: 5.0,
  uvStrengthOffset: 5.0,
};

export const worldConfig: WorldConfig[] = [
  {
    folder: {
      title: 'Fireflies',
    },
    bindings: [
      {
        key: 'baseSize',
        options: {
          label: 'Size',
          min: 0.01,
          max: 2.0,
          step: 0.01,
        },
      },
      {
        key: 'color',
        options: {
          label: 'Color',
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
          label: 'Inner Color',
          color: { type: 'float' },
        },
      },
      {
        key: 'portalColorEnd',
        options: {
          label: 'Outer Color',
          color: { type: 'float' },
        },
      },
      {
        key: 'uvDisplacementOffset',
        options: {
          label: 'Displacement',
          min: 0,
          max: 50,
          step: 0.1,
        },
      },
      {
        key: 'uvStrengthOffset',
        options: {
          label: 'Strength',
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
          label: 'Pole Light Color',
          color: { type: 'float' },
        },
      },
    ],
  },
];
