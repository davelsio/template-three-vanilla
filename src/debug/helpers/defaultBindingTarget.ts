import { BindingTarget, RgbaColorObject } from '@tweakpane/core';
import { isThreeColor } from '@type-guards/isThreeColor';
import { Color } from 'three';

/**
 * Default reader function bound to its target.
 * @param target binding target
 * @param value default reader value
 */
export function defaultReader<V>(target: BindingTarget, value: V) {
  const _reader = target.read.bind(target);
  return _reader() ?? value;
}

/**
 * Default writer function bound to its target.
 * @param target binding target
 * @param value writing value
 */
export function defaultPrimitiveWriter(target: BindingTarget, value: unknown) {
  const _writer = target.write.bind(target);
  _writer(value);
}

/**
 * Default color writer function bound to its target.
 * @param target binding target
 * @param obj color object
 */
export function defaultColorWriter(
  target: BindingTarget,
  obj: Color | RgbaColorObject
) {
  const writer = target.writeProperty.bind(target);
  writer('r', obj.r);
  writer('g', obj.g);
  writer('b', obj.b);
  if (!isThreeColor(obj)) {
    writer('a', obj.a);
  }
}
