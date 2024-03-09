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
import {
  InputBindingArgs,
  InputBindingArgsWithStateParams,
} from '../helpers/customTypes';

/**
 * Default plugin type alias.
 */
type ColorNumberInputPlugin = typeof DefaultNumberColorInputPlugin;

/**
 * Default binding arguments.
 */
type ColorNumberInputArgs = InputBindingArgs<ColorNumberInputPlugin>;

/**
 * Extended binding args with custom _reader and _writer params.
 */
type ColorNumberInputBindingArgsExtended =
  InputBindingArgsWithStateParams<ColorNumberInputPlugin>;

function getColorNumberReader(
  args: ColorNumberInputArgs
): BindingReader<IntColor> {
  const {
    target,
    params: { _reader, supportsAlpha },
  } = args as ColorNumberInputBindingArgsExtended;
  const colorFromNumber = supportsAlpha
    ? colorFromRgbaNumber
    : colorFromRgbNumber;
  return (_: unknown) => {
    const value = _reader(target.key);
    return colorFromNumber(value);
  };
}

/**
 * Custom color <number>input writer function.
 * @param args binding arguments
 */
function getColorNumberWriter(
  args: ColorNumberInputArgs
): BindingWriter<IntColor> {
  const {
    params: { _writer, supportsAlpha },
  } = args as ColorNumberInputBindingArgsExtended;
  const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
  return (target, value) => {
    _writer({ [target.key]: colorToNumber(value) });
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
