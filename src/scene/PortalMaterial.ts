import type { Color } from 'three';

import { shaderMaterial, type ShaderMaterialType } from '@helpers/three';

type PortalMaterialUniforms = {
  uColorEnd: Color;
  uColorStart: Color;
  uOffsetDisplacementUv: number;
  uOffsetStrengthUv: number;
  uTime: number;
};

export type PortalMaterial = ShaderMaterialType<typeof PortalMaterial>;

export const PortalMaterial = shaderMaterial<PortalMaterialUniforms>();
