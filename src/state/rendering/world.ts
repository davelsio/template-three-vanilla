import { atom, ExtractAtomValue } from 'jotai';

export type ViewsProgressAtom = typeof viewsProgressAtom;
export type ViewsProgressAtomValue = ExtractAtomValue<ViewsProgressAtom>;

export const viewsToLoadAtom = atom<string[]>([]);

export const viewsLoadedAtom = atom<string[]>([]);

export const viewsProgressAtom = atom((get) => {
  const viewsToLoad = get(viewsToLoadAtom);
  const viewsLoaded = get(viewsLoadedAtom);
  return viewsToLoad ? viewsLoaded.length / viewsToLoad.length : 0;
});
