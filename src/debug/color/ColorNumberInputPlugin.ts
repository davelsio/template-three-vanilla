import {
  ColorController,
  colorFromRgbaNumber,
  colorFromRgbNumber,
  ColorInputParams,
  colorToHexRgbaString,
  colorToHexRgbString,
  createColorStringParser,
  createPlugin,
  equalsColor,
  Formatter,
  InputBindingPlugin,
  IntColor,
} from '@tweakpane/core';
import { createColorNumberWriter } from '@tweakpane/core/dist/input-binding/color/converter/writer';
import { parseColorInputParams } from '@tweakpane/core/dist/input-binding/color/util';

import { getCustomAccept } from '../getCustomAccept';
import { getColorNumberWriter } from '../getCustomBindings';

function shouldSupportAlpha(inputParams: ColorInputParams): boolean {
  if (inputParams?.color?.alpha) {
    return true;
  }
  return false;
}

function createFormatter(supportsAlpha: boolean): Formatter<IntColor> {
  return supportsAlpha
    ? (v: IntColor) => colorToHexRgbaString(v, '0x')
    : (v: IntColor) => colorToHexRgbString(v, '0x');
}

function isForColor(params: Record<string, unknown>): boolean {
  if ('color' in params) {
    return true;
  }
  if (params.view === 'color') {
    return true;
  }
  return false;
}

export interface NumberColorInputParams extends ColorInputParams {
  supportsAlpha: boolean;
}

export const ColorNumberInputPlugin: InputBindingPlugin<
  IntColor,
  number,
  NumberColorInputParams
> = createPlugin({
  id: 'input-color-number',
  type: 'input',
  accept: (value, params) => {
    if (typeof value !== 'number') {
      return null;
    }
    if (!isForColor(params)) {
      return null;
    }

    const result = parseColorInputParams(params);
    return result
      ? {
          initialValue: value,
          params: {
            ...result,
            ...getCustomAccept(params),
            supportsAlpha: shouldSupportAlpha(params),
          },
        }
      : null;
  },
  binding: {
    reader: (args) => {
      return args.params.supportsAlpha
        ? colorFromRgbaNumber
        : colorFromRgbNumber;
    },
    equals: equalsColor,
    writer: (args) =>
      getColorNumberWriter(args) ??
      createColorNumberWriter(args.params.supportsAlpha),
  },
  controller: (args) => {
    return new ColorController(args.document, {
      colorType: 'int',
      expanded: args.params.expanded ?? false,
      formatter: createFormatter(args.params.supportsAlpha),
      parser: createColorStringParser('int'),
      pickerLayout: args.params.picker ?? 'popup',
      supportsAlpha: args.params.supportsAlpha,
      value: args.value,
      viewProps: args.viewProps,
    });
  },
});
