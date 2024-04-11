import { atom, ExtractAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { appStore } from '@state/store';

export type ViewportAtom = ReturnType<typeof atomWithViewport>;
export type ViewportAtomValue = ExtractAtomValue<ViewportAtom>;

function getVp(el: HTMLElement) {
  const width = el.clientWidth;
  const height = el.clientHeight;
  const aspectRatio = width / height;
  const pixelRatio = Math.min(2, window.devicePixelRatio);
  return {
    root: el,
    width,
    height,
    aspectRatio,
    pixelRatio,
  };
}

function sub(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

export const atomWithViewport = atomFamily((selector: string) => {
  const el = document.querySelector(selector) as HTMLElement;
  if (!el) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  const vpAtom = atom(getVp(el));

  const updateSize = () => appStore.set(vpAtom, getVp(el));

  vpAtom.onMount = () => {
    const unsub = sub(updateSize);
    updateSize();
    return () => {
      unsub();
      atomWithViewport.remove(selector);
    };
  };

  return vpAtom;
});
