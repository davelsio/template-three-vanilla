import { atom } from 'jotai';
import { Vector2 } from 'three';

const getDims = (el: HTMLElement) => ({
  width: el.clientWidth,
  height: el.clientHeight,
});

export function atomWithCursor(el: HTMLElement) {
  const cursorAtom = atom(new Vector2(9999, 9999)); // start off-screen

  const getCursor = (event: PointerEvent) => {
    const { width, height } = getDims(el);

    // Convert to clip space [-1, 1]
    const x = (event.clientX / width) * 2 - 1; // left to right
    const y = -(event.clientY / height) * 2 + 1; // bottom to top
    return new Vector2(x, y);
  };

  const sub = (callback: (event: PointerEvent) => void) => {
    window.addEventListener('pointermove', callback);
    return () => window.removeEventListener('pointermove', callback);
  };

  cursorAtom.onMount = (set) => {
    const callback = (event: PointerEvent) => {
      set(getCursor(event));
    };
    const unsub = sub(callback);
    return () => unsub;
  };

  return cursorAtom;
}
