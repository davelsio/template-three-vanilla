import {
  BindingReader,
  BindingWriter,
  Color,
  IntColor,
  RgbaColorObject,
  RgbColorObject,
} from '@tweakpane/core';
import {
  colorToRgbaNumber,
  colorToRgbNumber,
} from '@tweakpane/core/dist/input-binding/color/converter/color-number';
import { colorFromObject } from '@tweakpane/core/dist/input-binding/color/converter/color-object';
import { mapColorType } from '@tweakpane/core/dist/input-binding/color/model/colors';
import { isThreeColor } from '@type-guards/isThreeColor';
import { Color as ThreeColor } from 'three';

import { NumberColorInputParams } from './color/ColorNumberInputPlugin';
import { ObjectColorInputParams } from './color/ColorObjectInputPlugin';
import { BaseParams, BindingArguments, WithStateParams } from './StateBundle';

type ColorNumberArgs = BindingArguments<number, NumberColorInputParams>;

type ColorObjectArgs = BindingArguments<
  RgbColorObject | RgbaColorObject,
  ObjectColorInputParams
>;
type ColorObjectStateArgs = WithStateParams<ColorObjectArgs>;

/**
 * Custom color <number>input writer function.
 * @param args binding arguments
 */
export function getColorNumberWriter(
  args: ColorNumberArgs
): BindingWriter<IntColor> {
  const { _writer, supportsAlpha } =
    args.params as WithStateParams<ColorNumberArgs>['params'];
  const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
  return (target, value) => {
    _writer({ [target.key]: colorToNumber(value) });
  };
}

/**
 * Custom color <object>input reader function.
 * @param args binding arguments
 */
export function getColorObjectReader(
  args: ColorObjectArgs
): BindingReader<IntColor> {
  const {
    target,
    params: { colorType, _reader },
  } = args as ColorObjectStateArgs;
  return (_) => {
    const value = _reader(target.key);
    const c = colorFromObject(value, colorType);
    return mapColorType(c, 'int');
  };
}

/**
 * Custom color <object>input writer function.
 * @param args binding arguments
 */
export function getColorObjectWriter(
  args: ColorObjectArgs
): BindingWriter<Color> {
  const { colorType, _writer } = args.params as ColorObjectStateArgs['params'];
  return (target, inValue) => {
    const cc = mapColorType(inValue, colorType);
    const obj = cc.toRgbaObject();
    const color = new ThreeColor(obj.r, obj.g, obj.b);
    _writer({ [target.key]: isThreeColor(inValue) ? color : obj });
  };
}

/**
 * Custom number input/monitor reader function.
 * @param _args binding arguments
 */
export function getNumberReader<T, P extends BaseParams>(
  _args: BindingArguments<T, P>
): BindingReader<T> | undefined {
  const {
    params: { _reader },
    target,
  } = _args as WithStateParams<BindingArguments<T, P>>;
  return _reader
    ? (_) => {
        return _reader?.(target.key);
      }
    : undefined;
}

/**
 * Custom number input/monitor writer function.
 * @param _args binding arguments
 */
export function getNumberWriter<T, P extends BaseParams>(
  _args: BindingArguments<T, P>
): BindingWriter<T> | undefined {
  const {
    params: { _writer },
  } = _args as WithStateParams<BindingArguments<T, P>>;
  return _writer
    ? (target, value) => {
        return _writer?.({ [target.key]: value });
      }
    : undefined;
}
