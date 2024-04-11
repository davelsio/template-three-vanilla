import { atomWithBindingFolder } from '../debug';

const atomWithGradientBinding = atomWithBindingFolder({ title: 'Gradient' });

export const animationFadeAtom = atomWithGradientBinding(
  'Animation Fade',
  1.0,
  {
    min: 0.1,
    max: 2.0,
    step: 0.01,
  }
);

export const animationSpeedAtom = atomWithGradientBinding(
  'Animation Speed',
  2.0,
  {
    min: 0.1,
    max: 5.0,
    step: 0.1,
  }
);

export const waveFrequencyAtom = atomWithGradientBinding(
  'Wave Frequency',
  0.3,
  {
    min: 0.1,
    max: 1.0,
    step: 0.01,
  }
);

export const waveSpeedAtom = atomWithGradientBinding('Wave Speed', 2.0, {
  min: 0.1,
  max: 5.0,
  step: 0.1,
});
