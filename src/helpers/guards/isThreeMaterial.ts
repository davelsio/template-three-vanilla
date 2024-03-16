import { MeshStandardMaterial } from 'three';

export function isThreeMeshStandardMaterial(
  x: unknown
): x is MeshStandardMaterial {
  return x instanceof MeshStandardMaterial;
}
