import { atomWithBindingFolder } from '@atoms/atomWithBinding';

const fireflyBinding = atomWithBindingFolder({ title: 'Fireflies' });

export const fireflySizeAtom = fireflyBinding('Size', 0.75, {
  min: 0.01,
  max: 2.0,
  step: 0.01,
});

export const fireflyColorAtom = fireflyBinding('Color', '#ffffff');
