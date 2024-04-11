import { atom } from 'jotai';

export const loadedAssetsAtom = atom(0);

export const totalAssetsAtom = atom(0);

export const loadingProgressAtom = atom((get) => {
  const loaded = get(loadedAssetsAtom);
  const total = get(totalAssetsAtom);
  return total ? loaded / total : 0;
});

export const notifyAssetLoadedAtom = atom(null, (get, set) => {
  const loaded = get(loadedAssetsAtom) + 1;
  set(loadedAssetsAtom, loaded);
});
