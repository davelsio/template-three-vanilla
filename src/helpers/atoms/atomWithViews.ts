import { atom, type ExtractAtomValue } from 'jotai';

export type ViewsAtom = ReturnType<typeof atomWithViews>;
export type ViewsAtomValue = ExtractAtomValue<ViewsAtom>;

export function atomWithViews() {
  const viewsAtom = atom<Array<{ name: string; loaded?: boolean }>>([]);
  return viewsAtom;
}
