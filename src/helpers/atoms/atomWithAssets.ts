import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import type { CubeTexture, DataTexture, Texture } from 'three';
import type { GLTF } from 'three-stdlib';

import {
  type CubeTextureAssets,
  type DataTextureAssets,
  type GLTFAssets,
  ResourceLoader,
  type ResourceLoaderParams,
  Store,
  type TextureAssets,
} from '@helpers/three';

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

export function atomWithAssets<
  CubeTextures extends CubeTextureAssets,
  DataTextures extends DataTextureAssets,
  Textures extends TextureAssets,
  GLTFs extends GLTFAssets,
>(
  store: Store,
  ...args: ResourceLoaderParams<CubeTextures, DataTextures, Textures, GLTFs>
) {
  const resourceLoader = new ResourceLoader(...args);

  type Cache = {
    cubeTexture: Record<keyof CubeTextures, CubeTexture>;
    dataTexture: Record<keyof DataTextures, DataTexture>;
    texture: Record<keyof Textures, Texture>;
    gltf: Record<keyof GLTFs, GLTF>;
  };

  const cacheAtom = atom<Cache>({
    cubeTexture: {},
    dataTexture: {},
    texture: {},
    gltf: {},
  } as Cache);

  cacheAtom.onMount = () => {
    const _assets = args[0];
    let count = 0;

    const cubeTextures = _assets?.cubeTextures;
    if (cubeTextures) {
      count += Object.keys(cubeTextures).length;
    }

    const dataTextures = _assets?.dataTextures;
    if (dataTextures) {
      count += Object.keys(dataTextures).length;
    }

    const textures = _assets?.textures;
    if (textures) {
      count += Object.keys(textures).length;
    }

    const gltfs = _assets?.gltfs;
    if (gltfs) {
      count += Object.keys(gltfs).length;
    }

    store.set(totalAssetsAtom, count);
  };

  const texturesFamily = atomFamily((name: keyof Textures) => {
    const texturesAtom = atom(
      async (get) => {
        const cached = get(cacheAtom).texture[name];
        if (cached) {
          return cached;
        }
        const texture = await resourceLoader.loadTexture(name);
        store.set(cacheAtom, (prev) => ({
          ...prev,
          texture: {
            ...prev.texture,
            [name]: texture,
          },
        }));
        store.set(notifyAssetLoadedAtom);
        return texture;
      },
      (_get, set, paylaod: Texture) => {
        set(cacheAtom, (prev) => ({
          ...prev,
          texture: {
            ...prev.texture,
            [name]: paylaod,
          },
        }));
      }
    );

    texturesAtom.onMount = (_set) => {
      return () => texturesFamily.remove(name);
    };

    return texturesAtom;
  });

  const gltfsFamily = atomFamily((name: keyof GLTFs) => {
    const gltfsAtom = atom(
      async (get) => {
        const cached = get(cacheAtom).gltf[name];
        if (cached) {
          return cached;
        }

        const model = await resourceLoader.loadGltfModel(name);
        store.set(cacheAtom, (prev) => ({
          ...prev,
          gltf: {
            ...prev.gltf,
            [name]: model,
          },
        }));
        store.set(notifyAssetLoadedAtom);
        return model;
      },
      (_get, set, payload: GLTF) => {
        set(cacheAtom, (prev) => ({
          ...prev,
          gltf: {
            ...prev.gltf,
            [name]: payload,
          },
        }));
      }
    );

    gltfsAtom.onMount = (_set) => {
      return () => gltfsFamily.remove(name);
    };

    return gltfsAtom;
  });

  return { gltfsFamily, texturesFamily };
}
