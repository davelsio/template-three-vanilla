import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { atomWithLocation } from 'jotai-location';
import { FolderApi, Pane } from 'tweakpane';
import type { BindingParams, FolderParams } from '@tweakpane/core';

import {
  type Store,
  subscribe,
  type SubscribeToAtomArgs,
} from '@helpers/jotai';

type AtomWithTweakOptions = BindingParams & {
  /**
   * Automatically refresh the tweakpane UI when the atom changes.
   */
  listen?: boolean;
};

const locationAtom = atomWithLocation();

const tweakpaneAtom = atom((get) => {
  const pane = new Pane({ title: 'Debug Panel', expanded: false });
  const location = get(locationAtom);
  pane.hidden = location.searchParams?.get('debug') !== 'true';
  return pane;
});

const tweakpaneFolderFamily = atomFamily(
  (folderParams: FolderParams) =>
    atom<FolderApi>((get) => {
      const pane = get(tweakpaneAtom);
      return pane.addFolder(folderParams);
    }),
  (a, b) => a.title === b.title
);

/**
 * Atom factory to create atoms attached to a tweakpane binding. If no folder
 * params are provided, the atom will be attached to the tweakpane root blade.
 * @param store Jotai store
 * @param folderParams tweakpane folder params
 */
export function atomWithBinding(store: Store, folderParams?: FolderParams) {
  return <T>(label: string, value: T, options?: AtomWithTweakOptions) => {
    const prevAtom = atom(value);
    const currAtom = atom(value);

    const bindingAtom = atom(
      (get) => get(currAtom),
      (get, set, arg: T) => {
        const prevVal = get(currAtom);
        set(prevAtom, prevVal);
        set(currAtom, arg);
      }
    );

    bindingAtom.onMount = () => {
      const { get, set, sub } = store;

      const { listen, ...params } = options ?? {};

      const folder = folderParams && tweakpaneFolderFamily(folderParams);
      const pane = folder ? get(folder) : get(tweakpaneAtom);

      const key = bindingAtom.toString();
      const obj = { [key]: value };
      const binding = pane.addBinding(obj, key, {
        label,
        ...params,
      });
      binding.on('change', ({ value }) => {
        set(bindingAtom, value);
      });

      // Create non-reactive updates in the tweakpane UI or elsewhere
      const unsubListener = listen
        ? sub(bindingAtom, () => binding.refresh())
        : undefined;

      return () => {
        unsubListener?.();
        binding.dispose();
        pane.remove(binding);
        if (pane.children.length === 0) {
          const rootPane = get(tweakpaneAtom);
          rootPane.remove(pane);
          if (folderParams) {
            tweakpaneFolderFamily.remove(folderParams);
          }
        }
      };
    };

    return {
      _atom: bindingAtom,
      get: () => store.get(bindingAtom),
      sub: (...args: SubscribeToAtomArgs<T, void>) => {
        return subscribe(store, bindingAtom, ...args);
      },
    };
  };
}
