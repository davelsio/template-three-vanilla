import { atomWithAssets, atomWithBinding } from '@helpers/atoms';
import { createThreeState } from '@helpers/three';

export const portalState = createThreeState();

/**
 * Assets
 */
export const assets = atomWithAssets(portalState.store, {
  textures: {
    portalBakedTexture: 'baked.jpg',
  },
  gltfs: {
    portalModel: 'portal.glb',
  },
  options: {
    draco: true,
  },
});

/**
 * Debug Bindings
 */
const sceneBinding = atomWithBinding(portalState.store, {
  title: 'Scene',
  expanded: false,
});
const fireflyBinding = atomWithBinding(portalState.store, {
  title: 'Fireflies',
});
const portalBinding = atomWithBinding(portalState.store, {
  title: 'Portal',
});

/**
 * Scene bindings
 */
export const backgroundColorAtom = sceneBinding('Background Color', '#000011');

/**
 * Firefly bindings
 */
export const fireflySizeAtom = fireflyBinding('Size', 0.75, {
  min: 0.01,
  max: 2.0,
  step: 0.01,
});

export const fireflyColorAtom = fireflyBinding('Color', '#ffffff');

/**
 * Portal bindings
 */
export const portalLightColorAtom = portalBinding('Light Color', '#ffffff');

export const portalColorOuterAtom = portalBinding('Outer Color', '#000000');

export const portalColorInnerAtom = portalBinding('Inner Color', '#ffffff');

export const portalDisplacementAtom = portalBinding('Displacement', 5.0, {
  min: 0,
  max: 50,
  step: 0.1,
});
export const portalStrengthAtom = portalBinding('Strength', 5.0, {
  min: 0,
  max: 50,
  step: 0.1,
});
