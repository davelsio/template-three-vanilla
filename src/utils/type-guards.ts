import { Mesh, MeshStandardMaterial } from 'three';

export function isThreeMesh(x: unknown): x is Mesh {
  return x instanceof Mesh;
}

export function isThreeMeshStandardMaterial(
  x: unknown
): x is MeshStandardMaterial {
  return x instanceof MeshStandardMaterial;
}
