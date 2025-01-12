import { atom } from 'jotai';

export function atomWithPixelRatio() {
  const px = getPixelRatio();
  const pxAtom = atom(px);

  pxAtom.onMount = (set) => {
    const callback = () => set(getPixelRatio());
    const unsubscribe = subscribeToPixelRatio(callback);
    callback();
    return unsubscribe;
  };

  return pxAtom;
}

function getPixelRatio() {
  return Math.min(window.devicePixelRatio, 2);
}

function subscribeToPixelRatio(callback: () => void) {
  const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
  const media = window.matchMedia(mqString);
  media.addEventListener('change', callback, {
    once: true,
  });
  return () => media.removeEventListener('change', callback);
}
