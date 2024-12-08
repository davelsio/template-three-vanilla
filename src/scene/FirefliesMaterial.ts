import type { Color, Vector2 } from 'three';

import { shaderMaterial, type ShaderMaterialType } from '@helpers/three';

type FireFliesUniforms = {
  uTime: number;
  uColor: Color;
  uResolution: Vector2;
  uSize: number;
};

export type FirefliesMaterial = ShaderMaterialType<typeof FirefliesMaterial>;

export const FirefliesMaterial = shaderMaterial<FireFliesUniforms>();
