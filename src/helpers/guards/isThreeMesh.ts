import { Mesh } from 'three';

export function isThreeMesh<T extends Mesh>(x: unknown): x is T {
  return x instanceof Mesh || (x as Mesh).isMesh;
}
