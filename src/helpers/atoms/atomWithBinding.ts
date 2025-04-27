import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { atomWithLocation } from 'jotai-location';
import { FolderApi, Pane } from 'tweakpane';
import { PaneConfig } from 'tweakpane/dist/types/pane/pane-config';
import type { BindingParams, FolderParams } from '@tweakpane/core';

import { type Store, subscribe, type SubscribeToAtomArgs } from '../jotai';

interface PaneOptions extends Pick<PaneConfig, 'expanded' | 'title'> {
  type: 'root';
}

interface FolderOptions extends FolderParams {
  type?: 'folder';
}

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
      pane.expanded = Boolean(folderParams.expanded);
      return pane.addFolder(folderParams);
    }),
  (a, b) => a.title === b.title
);

/**
 * Atom factory to create atoms attached to a tweakpane binding. If no folder
 * params are provided, the atom will be attached to the tweakpane root blade.
 * @param store Jotai store
 * @param params tweakpane folder params
 */
export function atomWithBinding(
  store: Store,
  params?: PaneOptions | FolderOptions
) {
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

      const { listen, ...bindingOptions } = options ?? {};

      const folder =
        params && params.type !== 'root' && tweakpaneFolderFamily(params);
      const pane = folder ? get(folder) : get(tweakpaneAtom);

      if (params?.type === 'root') {
        pane.title = params.title ?? pane.title;
        pane.expanded = params.expanded ?? pane.expanded;
      }

      const key = bindingAtom.toString();
      const obj = { [key]: value };
      const binding = pane.addBinding(obj, key, {
        label,
        ...bindingOptions,
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
          if (params?.type === 'folder') {
            tweakpaneFolderFamily.remove(params);
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
