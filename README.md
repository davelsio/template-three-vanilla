## Description

A completely deranged and insolent approach to creating Three.js experiences. This is just for me to run quick experiments.

It leverages `jotai` atoms to create a sort of functional state management. All helpers can be found in the [helpers](./src/helpers) folder, and there is an example experience within the [scene](./src/scene/) folder.

### Features

- Atom-based architecture to manage scene state and assets.
- Custom [Tweakpane](https://tweakpane.github.io/docs/) bindings as Jotai atoms.

## Usage

### Experience

Create and mount the experience via the [`atomWithThree`](./src/helpers/atoms/atomWithThree.ts) atom.

```ts
import { createStore } from 'jotai';
import { atomWithThree } from '@helpers/atoms';

export const store = createStore();
export const {
  camera,
  controls,
  renderer,
  scene,
  three,
  viewport,
  views,
} = atomWithThree('#root', store);

const unmount = three.mount(); // <- This starts the whole thing
unmount(); // <- This unmounts the experience
```

### Assets

Available either via the [atomWithAssets](./src/helpers/atoms/atomWithAssets.ts) or the [ResourceLoader](src/loaders/ResourceLoader.ts) class. Everything is type-safe.

```ts
// Make sure the assets exist in the `public/` folder.
export const assets = atomWithAssets(store, {
  textures: {
    portalBakedTexture: 'baked.jpg',
  },
  gltfs: {
    portalModel: 'portal.glb',
  },
  options: {
    draco: true,
  },
});

// Somewhere else...
const texture = await assets.textures.get('portalBakedTexture');
const model = await assets.gltfs.get('portalModel');
```

### Debug Panels

> [!NOTE]
> By default, the debug UI only shows up in the `/debug` route.

Atom-based solution that powered by [tweakpane](https://github.com/cocopon/tweakpane). Debug tweaks can be added using the [`atomWithBinding`](./src/helpers/atoms/atomWithBinding.ts) atom.

[Bindings](https://tweakpane.github.io/docs/input-bindings/) can be added directly to the root pane or within folders [folders](https://tweakpane.github.io/docs/ui-components/#folder). It uses the same APIs described in the official tweakpane docs.

I've added an option to automatically listen to external updates, similarly to [lil-gui listen method](https://lil-gui.georgealways.com/#Controller#listen). Tweak visibility can also be configured per route.

```ts
// ./src/scene/PortalState.ts

import type { Store } from '@helpers/three'
import { atomWithBinding } from '@atoms/atomWithBinding';
import { portalState } from "./PortalState";

// Helper that creates a scoped Jotai store, calls atomWithThree, and provides
// a few convenience helpers used by the `WebGLView` abstract class.
export const portalState = createThreeState();

const portalFolderBinding = atomWithBinding(portalState.store, { title: 'Portal' });

export const portalDisplacement = portalFolderBinding('Displacement', 5.0, {
  min: 0,
  max: 50,
  step: 0.1,
});

portalDisplacement.get(); // => current value
portalDisplacement.sub((value) => {
  // Fires whenever the value changes
});
portalDisplacement._atom; // => the actual jotai atom
```

### Views

Just create geometries, materials, and meshes normally then add them to the scene. If you want, there is a [WebGLView](src/helpers/three/WebGLView.ts) class that can be extended to create a base view with some helpful methods.

This class extends the Three.js `Group` interface and knows how to add and remove itself from the experience. It also takes care of loading flags and updating the state.

### Styles

Some optional css styles, feel free to ignore them.

- `reset.css`: Pretty much a copy-paste from the amazing Josh Comeau [custom CSS reset](https://www.joshwcomeau.com/css/custom-css-reset/). This one also removes default `padding` and button `border`.
- `webgl.css`: Applies only the WebGL `canvas` to remove it from the document flow and create its own stacking context. Regardless of this CSS, the experience will always respect the parent container dimensions, whether it is the document or some other element.
- `tweakpane.css`: Adds some extra width to the main debug pane and slightly adjusts the label:input width proportion of each binding blade so the input takes the majority of the available space.

## Develop

This project was created with [pnpm](https://pnpm.io), but any other package manager will work. Bundling is handled by [Vite](https://vitejs.dev).

```shell
pnpm install # install package dependencies
pnpm dev     # start development server
pnpm lint    # [--fix] lint files
```
