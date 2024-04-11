import { Vector2, Vector3, Vector4 } from 'three';

export function isThreeVector<T extends Vector2 | Vector3 | Vector4>(
  x: unknown
): x is T {
  return x instanceof Vector3 || x instanceof Vector2;
}
