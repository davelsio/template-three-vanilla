import { BindingConfig } from '@controllers/Debug';

/**
 * Debug variables.
 */
export type TimeSettings = typeof timeSettings;
export type TimeConfig = BindingConfig<TimeSettings>;

export const timeSettings = {
  fps: 0,
  showFps: true,
};

export const timeConfig: TimeConfig[] = [
  {
    bindings: [
      // {
      //   key: 'fps',
      //   options: {
      //     index: 0,
      //     // view: 'graph',
      //     // min: 0,
      //     // max: 250,
      //     label: 'FPS',
      //     condition: 'showFps',
      //     readonly: true,
      //   },
      // },
      // {
      //   key: 'showFps',
      //   options: {
      //     index: 1,
      //     label: 'Show FPS',
      //   },
      // },
    ],
  },
];
