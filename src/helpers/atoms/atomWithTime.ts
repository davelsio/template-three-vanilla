import gsap from 'gsap';
import { atom, type ExtractAtomValue } from 'jotai';

export type TimeAtom = ReturnType<typeof atomWithTime>;
export type TimeAtomValue = ExtractAtomValue<TimeAtom>;

export function atomWithTime() {
  const timeAtom = atom({
    delta: 1000 / 60, // ~60fps
    elapsed: 0,
    fps: 0,
  });

  timeAtom.onMount = (set) => {
    const unsub = gsap.ticker.add(
      (time: number, delta: number, _frame: number, _elapsed: number) => {
        const fps = (1 / delta) * 1000;
        set({ delta, elapsed: time, fps });
      }
    );

    return unsub;
  };

  return timeAtom;
}
