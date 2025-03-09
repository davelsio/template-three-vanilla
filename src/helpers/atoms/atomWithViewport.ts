import { atom, type ExtractAtomValue } from 'jotai';

import type { Store } from '../jotai';

export type ViewportAtom = ReturnType<typeof atomWithViewport>;
export type ViewportAtomValue = ExtractAtomValue<ViewportAtom>;

export const atomWithViewport = (selector: string, store: Store) => {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  const vpAtom = atom(getVp(el));

  const updateSize = () => store.set(vpAtom, getVp(el));

  vpAtom.onMount = () => {
    const unsub = sub(updateSize, true);
    return unsub;
  };

  return vpAtom;
};

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

function sub(callback: () => void, callImmediately = false) {
  window.addEventListener('resize', callback);
  if (callImmediately) {
    callback();
  }
  return () => window.removeEventListener('resize', callback);
}
