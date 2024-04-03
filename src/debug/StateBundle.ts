import { TpPluginBundle } from '@tweakpane/core';

import { BooleanInputPlugin } from './boolean/BooleanInputPlugin';
import { ColorNumberInputPlugin } from './color/ColorNumberInputPlugin';
import { ColorObjectInputPlugin } from './color/ColorObjectInputPlugin';
import { ColorStringInputPlugin } from './color/ColorStringInputPlugin';
import { NumberInputPlugin } from './number/NumberInputPlugin';
import { NumberMonitorPlugin } from './number/NumberMonitorPlugin';
import { StringInputPlugin } from './string/StringInputPlugin';

/**
 * Default plugin overrides to support zustand state management.
 */
export const StateBundle: TpPluginBundle = {
  id: 'state-compatibility',
  plugins: [
    BooleanInputPlugin,
    NumberInputPlugin,
    NumberMonitorPlugin,
    StringInputPlugin,
    ColorStringInputPlugin,
    ColorNumberInputPlugin,
    ColorObjectInputPlugin,
  ],
};
