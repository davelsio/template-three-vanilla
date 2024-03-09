import {
  BindingReader,
  BindingWriter,
  Color,
  IntColor,
  ObjectColorInputPlugin as DefaultObjectColorInputPlugin,
} from '@tweakpane/core';
import { colorFromObject } from '@tweakpane/core/dist/input-binding/color/converter/color-object';
import { mapColorType } from '@tweakpane/core/dist/input-binding/color/model/colors';
import { isThreeColor } from '@type-guards/isThreeColor';
import { Color as ThreeColor } from 'three';

import { customAccept } from '../helpers/customAccept';
import {
  InputBindingArgs,
  InputBindingArgsWithStateParams,
} from '../helpers/customTypes';

/**
 * Default plugin type alias.
 */
type TColorObjectInputPlugin = typeof DefaultObjectColorInputPlugin;

/**
 * Default binding arguments.
 */
type ColorObjectInputBindingArgs = InputBindingArgs<TColorObjectInputPlugin>;

/**
 * Extended binding args with custom reader and writer params.
 */
type ColorObjectInputBindingArgsExtended =
  InputBindingArgsWithStateParams<TColorObjectInputPlugin>;

/**
 * Custom color reader function.
 * @param args binding arguments
 */
function getColorObjectReader(
  args: ColorObjectInputBindingArgs
): BindingReader<IntColor> {
  const {
    target,
    params: { colorType, _reader },
  } = args as ColorObjectInputBindingArgsExtended;
  return (_) => {
    const value = _reader(target.key);
    const c = colorFromObject(value, colorType);
    return mapColorType(c, 'int');
  };
}

/**
 * Custom color writer function.
 * @param args binding arguments
 */
function getColorObjectWriter(
  args: ColorObjectInputBindingArgs
): BindingWriter<Color> {
  const {
    params: { colorType, _writer },
  } = args as ColorObjectInputBindingArgsExtended;
  return (target, inValue) => {
    const cc = mapColorType(inValue, colorType);
    const obj = cc.toRgbaObject();

    const isColor = isThreeColor(target.read());
    const color = new ThreeColor(obj.r, obj.g, obj.b);

    _writer({ [target.key]: isColor ? color : obj });
  };
}

/**
 * Override the binding and accept functions.
 */
const {
  accept, // passes params to the binding
  api,
  binding, // defines reader and writer functions
  controller,
  core,
  id,
  type,
} = DefaultObjectColorInputPlugin;

export const ColorObjectInputPlugin: TColorObjectInputPlugin = {
  id: id + 'state',
  type,
  accept: customAccept(accept),
  binding: {
    constraint: binding.constraint,
    equals: binding.equals,
    reader: getColorObjectReader,
    writer: getColorObjectWriter,
  },
  controller,
  core,
  api,
};
