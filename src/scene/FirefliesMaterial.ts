import { Color, Vector2 } from 'three';

import { shaderMaterial, ShaderMaterialType } from '@materials/shaderMaterial';
import { fireflyFragmentShader, fireflyVertexShader } from '@shaders/fireflies';
import { fireflyColorAtom, fireflySizeAtom } from '@state/portal/fireflies';
import { appStore } from '@state/store';

type FireFliesUniforms = {
  uTime: number;
  uColor: Color;
  uResolution: Vector2;
  uSize: number;
};

const uSize = appStore.get(fireflySizeAtom);
const uColor = appStore.get(fireflyColorAtom);

export type FirefliesMaterial = ShaderMaterialType<typeof FirefliesMaterial>;

export const FirefliesMaterial = shaderMaterial<FireFliesUniforms>(
  {
    uTime: 0,
    uColor: new Color(uColor),
    uResolution: new Vector2(),
    uSize,
  },
  fireflyVertexShader,
  fireflyFragmentShader
);
