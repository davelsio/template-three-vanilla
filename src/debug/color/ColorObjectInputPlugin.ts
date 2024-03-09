import {
  defaultColorWriter,
  defaultReader,
} from '@debug/helpers/defaultBindingTarget';
import {
  BindingReader,
  BindingWriter,
  Color,
  IntColor,
  ObjectColorInputPlugin as DefaultObjectColorInputPlugin,
  RgbaColorObject,
  RgbColorObject,
} from '@tweakpane/core';
import { colorFromObject } from '@tweakpane/core/dist/input-binding/color/converter/color-object';
import { mapColorType } from '@tweakpane/core/dist/input-binding/color/model/colors';
import { isThreeColor } from '@type-guards/isThreeColor';
import { Color as ThreeColor } from 'three';

import { customAccept } from '../helpers/customAccept';
import { InputBindingArgsWithStateParams } from '../helpers/customTypes';

/**
 * Default plugin type alias.
 */
type TColorObjectInputPlugin = typeof DefaultObjectColorInputPlugin;

/**
 * Extended binding args with custom reader and writer params.
 */
type ColorObjectInputBindingArgsExtended =
  InputBindingArgsWithStateParams<TColorObjectInputPlugin>;

/**
 * Custom color reader function.
 * @param args binding arguments
 */
function getColorObjectReader({
  params,
  target,
}: ColorObjectInputBindingArgsExtended): BindingReader<IntColor> {
  const _reader = params.reader ?? defaultReader;
  return (value) => {
    const _value = _reader(target, value as RgbColorObject | RgbaColorObject);
    const c = colorFromObject(_value, params.colorType);
    return mapColorType(c, 'int');
  };
}

/**
 * Custom color writer function.
 * @param args binding arguments
 */
function getColorObjectWriter({
  params,
}: ColorObjectInputBindingArgsExtended): BindingWriter<Color> {
  const _writer = params.writer ?? defaultColorWriter;
  return (target, inValue) => {
    const cc = mapColorType(inValue, params.colorType);
    const obj = cc.toRgbaObject();

    const isColor = isThreeColor(target.read());
    const color = new ThreeColor(obj.r, obj.g, obj.b);

    _writer(target, isColor ? color : obj);
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
