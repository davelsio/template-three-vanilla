import { atom } from 'jotai';

import { Store, subscribe, SubscribeToAtomArgs } from '../jotai';

export type ViewportAtomValue = {
  root: HTMLElement;
  width: number;
  height: number;
  aspectRatio: number;
  pixelRatio: number;
};

export type ViewportAtom = ReturnType<typeof atomWithViewport>;
export type ViewportOptions = {
  /**
   * Maximum device pixel ratio to use when rendering the scene. This value can
   * be also changed using the property setter of the return object.
   * Defaults to `2`.
   */
  maxPixelRatio?: number;
};

export const atomWithViewport = (
  store: Store,
  selector: string,
  { maxPixelRatio = 2 }: ViewportOptions = {}
) => {
  let _maxPixelRatio = maxPixelRatio;

  const el = document.querySelector<HTMLElement>(selector);
  if (!el) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  const vpAtom = atom(getVp(el, _maxPixelRatio));

  vpAtom.onMount = (set) => {
    const unsub = onWindowResize(() => set(getVp(el, _maxPixelRatio)), true);
    return unsub;
  };

  return {
    _atom: vpAtom,
    get root() {
      return store.get(vpAtom).root;
    },
    get width() {
      return store.get(vpAtom).width;
    },
    get height() {
      return store.get(vpAtom).height;
    },
    get aspectRatio() {
      return store.get(vpAtom).aspectRatio;
    },
    get pixelRatio() {
      return store.get(vpAtom).pixelRatio;
    },
    /**
     * Write-only property to set the maximum device pixel ratio used when
     * rendering the scene.
     */
    set maxPixelRatio(value: number) {
      _maxPixelRatio = value;
      store.set(vpAtom, getVp(el, value));
    },
    sub(...args: SubscribeToAtomArgs<ViewportAtomValue, void>) {
      return subscribe(store, vpAtom, ...args);
    },
  };
};

function getVp(el: HTMLElement, maxPixelRatio: number) {
  const width = el.clientWidth;
  const height = el.clientHeight;
  const aspectRatio = width / height;
  const pixelRatio = Math.min(maxPixelRatio, window.devicePixelRatio);
  return {
    root: el,
    width,
    height,
    aspectRatio,
    pixelRatio,
  };
}

function onWindowResize(callback: () => void, callImmediately = false) {
  window.addEventListener('resize', callback);
  if (callImmediately) {
    callback();
  }
  return () => window.removeEventListener('resize', callback);
}
