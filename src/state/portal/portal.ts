import { atomWithBindingFolder } from '@atoms/atomWithBinding';

const portalBinding = atomWithBindingFolder({ title: 'Portal' });

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

export const backgroundColorAtom = portalBinding('Background Color', '#000011');
