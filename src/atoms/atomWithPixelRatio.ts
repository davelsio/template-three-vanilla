import { atom } from 'jotai';

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

export function atomWithPixelRatio() {
  const px = getPixelRatio();
  const pxAtom = atom(px);

  pxAtom.onMount = (set) => {
    console.log('Pixel Ratio Mounted');
    const callback = () => set(getPixelRatio());
    const unsubscribe = subscribeToPixelRatio(callback);
    callback();
    return unsubscribe;
  };

  return pxAtom;
}
