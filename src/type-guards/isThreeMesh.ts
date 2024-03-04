import { Mesh } from 'three';

export function isThreeMesh(x: unknown): x is Mesh {
  return x instanceof Mesh;
}
