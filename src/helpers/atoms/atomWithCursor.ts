import { atom } from 'jotai';
import { Vector2 } from 'three';

export function atomWithCursor(el: HTMLElement) {
  const cursorAtom = atom(new Vector2(9999, 9999)); // start off-screen

  const getCursor = (event: PointerEvent) => {
    // Convert to clip space [-1, 1]
    const x = (event.clientX / el.clientWidth) * 2 - 1; // left to right
    const y = -(event.clientY / el.clientHeight) * 2 + 1; // bottom to top
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
