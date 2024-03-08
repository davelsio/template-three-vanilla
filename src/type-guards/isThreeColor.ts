import { Color } from 'three';

export function isThreeColor(value: unknown): value is Color {
  return value instanceof Color || (value as Color)?.isColor === true;
}
