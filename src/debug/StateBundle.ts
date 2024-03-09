import { TpPluginBundle } from '@tweakpane/core';

import { ColorNumberInputPlugin } from './color/ColorNumberInputPlugin';
import { ColorObjectInputPlugin } from './color/ColorObjectInputPlugin';
import { NumberInputPlugin } from './number/NumberInputPlugin';
import { NumberMonitorPlugin } from './number/NumberMonitorPlugin';

export const StateBundle: TpPluginBundle = {
  id: 'state-compatibility',
  plugins: [
    ColorNumberInputPlugin,
    ColorObjectInputPlugin,
    NumberInputPlugin,
    NumberMonitorPlugin,
  ],
};
