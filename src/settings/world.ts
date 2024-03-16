import { Color } from 'three';

import { BindingConfig } from '@controllers/Debug';

export type WorldSettings = typeof worldSettings;
export type WorldConfig = BindingConfig<WorldSettings>;

export const worldSettings = {
  loadingColor: { r: 0.03, g: 0.01, b: 0.0, a: 1.0 },
  fireflySize: 0.75,
  fireflyColor: new Color(0xffffff),
  poleLightColor: new Color(0xffffff),
  portalColorStart: new Color(0x000000),
  portalColorEnd: new Color(0xffffff),
  portalDisplacement: 5.0,
  portalStrength: 5.0,
};

export const worldConfig: WorldConfig[] = [
  {
    folder: {
      title: 'Loading',
    },
    bindings: [
      {
        key: 'loadingColor',
        options: {
          label: 'Color',
          color: { type: 'float' },
        },
      },
    ],
  },
  {
    folder: {
      title: 'Fireflies',
    },
    bindings: [
      {
        key: 'fireflySize',
        options: {
          label: 'Size',
          min: 0.01,
          max: 2.0,
          step: 0.01,
        },
      },
      {
        key: 'fireflyColor',
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
        key: 'portalDisplacement',
        options: {
          label: 'Displacement',
          min: 0,
          max: 50,
          step: 0.1,
        },
      },
      {
        key: 'portalStrength',
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
