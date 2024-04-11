import { Color } from 'three';

import { shaderMaterial, ShaderMaterialType } from '@materials/shaderMaterial';
import { portalFragmentShader, portalVertexShader } from '@shaders/portal';
import {
  portalColorInnerAtom,
  portalColorOuterAtom,
  portalDisplacementAtom,
} from '@state/portal/portal';
import { appStore } from '@state/store';

type PortalMaterialUniforms = {
  uColorEnd: Color;
  uColorStart: Color;
  uOffsetDisplacementUv: number;
  uOffsetStrengthUv: number;
  uTime: number;
};

const uColorEnd = new Color(appStore.get(portalColorInnerAtom));
const uColorStart = new Color(appStore.get(portalColorOuterAtom));
const uOffsetDisplacementUv = appStore.get(portalDisplacementAtom);
const uOffsetStrengthUv = appStore.get(portalDisplacementAtom);

export type PortalMaterial = ShaderMaterialType<typeof PortalMaterial>;

export const PortalMaterial = shaderMaterial<PortalMaterialUniforms>(
  {
    uTime: 0,
    uColorEnd,
    uColorStart,
    uOffsetDisplacementUv,
    uOffsetStrengthUv,
  },
  portalVertexShader,
  portalFragmentShader
);
