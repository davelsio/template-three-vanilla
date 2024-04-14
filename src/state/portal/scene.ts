import { atomWithBindingFolder } from '@atoms/atomWithBinding';

const sceneBinding = atomWithBindingFolder({
  title: 'Scene',
  expanded: false,
});

export const backgroundColorAtom = sceneBinding('Background Color', '#000011');
