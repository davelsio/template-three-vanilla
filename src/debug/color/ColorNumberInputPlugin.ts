import {
  defaultPrimitiveWriter,
  defaultReader,
} from '@debug/helpers/defaultBindingTarget';
import {
  BindingReader,
  BindingWriter,
  colorFromRgbaNumber,
  colorFromRgbNumber,
  colorToRgbaNumber,
  colorToRgbNumber,
  IntColor,
  NumberColorInputPlugin as DefaultNumberColorInputPlugin,
} from '@tweakpane/core';

import { customAccept } from '../helpers/customAccept';
import { InputBindingArgsWithStateParams } from '../helpers/customTypes';

/**
 * Default plugin type alias.
 */
type ColorNumberInputPlugin = typeof DefaultNumberColorInputPlugin;

/**
 * Extended binding args with custom reader and writer params.
 */
type ColorNumberInputBindingArgsExtended =
  InputBindingArgsWithStateParams<ColorNumberInputPlugin>;

function getColorNumberReader({
  params,
  target,
}: ColorNumberInputBindingArgsExtended): BindingReader<IntColor> {
  const _reader = params.reader ?? defaultReader;
  const colorFromNumber = params.supportsAlpha
    ? colorFromRgbaNumber
    : colorFromRgbNumber;
  return (value) => {
    const _value = _reader(target, value as number);
    return colorFromNumber(_value);
  };
}

/**
 * Custom color <number>input writer function.
 * @param args binding arguments
 */
function getColorNumberWriter({
  params,
}: ColorNumberInputBindingArgsExtended): BindingWriter<IntColor> {
  const colorToNumber = params.supportsAlpha
    ? colorToRgbaNumber
    : colorToRgbNumber;
  const _writer = params.writer ?? defaultPrimitiveWriter;
  return (target, value) => {
    _writer(target, colorToNumber(value));
  };
}

const {
  accept, // passes params to the binding
  api,
  binding, // defines reader and writer functions
  controller,
  id,
  type,
  core,
} = DefaultNumberColorInputPlugin;

export const ColorNumberInputPlugin: ColorNumberInputPlugin = {
  id,
  type,
  accept: customAccept(accept),
  binding: {
    constraint: binding.constraint,
    equals: binding.equals,
    reader: getColorNumberReader,
    writer: getColorNumberWriter,
  },
  controller,
  api,
  core,
};
