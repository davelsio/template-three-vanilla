import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

const canvas = document.createElement('canvas');
canvas.classList.add('webgl');

export const atomWithStage = atomFamily((selector: string) => {
  const el = document.querySelector(selector) as HTMLElement;
  if (!el) {
    throw new Error(`Element with selector "${selector}" not found`);
  }
  el.appendChild(canvas);

  const stageAtom = atom({
    root: el,
    canvas,
  });
  stageAtom.onMount = () => {
    return () => atomWithStage.remove(selector);
  };
  return stageAtom;
});
