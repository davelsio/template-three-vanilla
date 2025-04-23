import { atom } from 'jotai';

import { WebGLView } from '@helpers/three';

import { Store, subscribe, type SubscribeToAtomArgs } from '../jotai';

export type ViewsAtomValue = Array<{ name: string; loaded?: boolean }>;
export type ViewsAtom = ReturnType<typeof atomWithViews>;

export function atomWithViews(store: Store) {
  const viewsAtom = atom<ViewsAtomValue>([]);
  return {
    get _atom() {
      return viewsAtom;
    },
    get(view: string) {
      return store.get(viewsAtom).find((v) => v.name === view);
    },
    add(view: WebGLView) {
      store.set(viewsAtom, (views) => [
        ...views,
        { name: view.namespace, loaded: view.props.isLoaded },
      ]);
    },
    remove(name: string) {
      store.set(viewsAtom, (views) =>
        views.filter((view) => view.name !== name)
      );
    },
    setLoaded(name: string) {
      store.set(viewsAtom, (views) =>
        views.map((view) =>
          view.name === name ? { ...view, loaded: true } : view
        )
      );
    },
    sub(...args: SubscribeToAtomArgs<ViewsAtomValue, void>) {
      return subscribe(store, viewsAtom, ...args);
    },
  };
}
