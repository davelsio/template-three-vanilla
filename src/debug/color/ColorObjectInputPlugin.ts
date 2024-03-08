import { getCustomAccept } from '@debug/getCustomAccept';
import {
  getColorObjectReader,
  getColorObjectWriter,
} from '@debug/getCustomBindings';
import {
  BindingReader,
  Color,
  ColorController,
  ColorInputParams,
  colorToObjectRgbaString,
  colorToObjectRgbString,
  createColorStringParser,
  createPlugin,
  equalsColor,
  Formatter,
  InputBindingPlugin,
  IntColor,
  isColorObject,
  isRgbaColorObject,
  RgbaColorObject,
  RgbColorObject,
} from '@tweakpane/core';
import { colorFromObject } from '@tweakpane/core/dist/input-binding/color/converter/color-object';
import { createColorObjectWriter } from '@tweakpane/core/dist/input-binding/color/converter/writer';
import { ColorType } from '@tweakpane/core/dist/input-binding/color/model/color-model';
import { mapColorType } from '@tweakpane/core/dist/input-binding/color/model/colors';
import {
  extractColorType,
  parseColorInputParams,
} from '@tweakpane/core/dist/input-binding/color/util';

function shouldSupportAlpha(
  initialValue: RgbColorObject | RgbaColorObject
): boolean {
  return isRgbaColorObject(initialValue);
}

function createColorObjectBindingReader(
  type: ColorType
): BindingReader<IntColor> {
  return (value) => {
    const c = colorFromObject(value, type);
    return mapColorType(c, 'int');
  };
}

function createColorObjectFormatter(
  supportsAlpha: boolean,
  type: ColorType
): Formatter<Color> {
  return (value) => {
    if (supportsAlpha) {
      return colorToObjectRgbaString(value, type);
    }
    return colorToObjectRgbString(value, type);
  };
}

export interface ObjectColorInputParams extends ColorInputParams {
  colorType: ColorType;
}

/**
 * @hidden
 */
export const ColorObjectInputPlugin: InputBindingPlugin<
  IntColor,
  RgbColorObject | RgbaColorObject,
  ObjectColorInputParams
> = createPlugin({
  id: 'input-color-object',
  type: 'input',
  accept: (value, params) => {
    if (!isColorObject(value)) {
      return null;
    }
    const result = parseColorInputParams(params);
    return result
      ? {
          initialValue: value,
          params: {
            ...result,
            colorType: extractColorType(params) ?? 'int',
            ...getCustomAccept(params),
          },
        }
      : null;
  },
  binding: {
    reader: (args) =>
      getColorObjectReader(args) ??
      createColorObjectBindingReader(args.params.colorType),
    equals: equalsColor,
    writer: (args) =>
      getColorObjectWriter(args) ??
      createColorObjectWriter(
        shouldSupportAlpha(args.initialValue),
        args.params.colorType
      ),
  },
  controller: (args) => {
    const supportsAlpha = isRgbaColorObject(args.initialValue);
    return new ColorController(args.document, {
      colorType: args.params.colorType,
      expanded: args.params.expanded ?? false,
      formatter: createColorObjectFormatter(
        supportsAlpha,
        args.params.colorType
      ),
      parser: createColorStringParser('int'),
      pickerLayout: args.params.picker ?? 'popup',
      supportsAlpha: supportsAlpha,
      value: args.value,
      viewProps: args.viewProps,
    });
  },
});
