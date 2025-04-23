## Description

A completely deranged approach to creating Three.js experiences. This is just to have some fun.

It leverages `jotai` atoms to create a sort of functional three state management system. All helpers can be found in the [helpers](./src/helpers) folder, and there is an example experience within the [scene](./src/scene/) folder.

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
  mount,
  renderer,
  scene,
  viewport,
  views,
} = atomWithThree('#root', store);

// Starts the whole thing
const unmount = mount();

// Unmount the experience
unmount();
```

### Assets

Available either via the [atomWithAssets](./src/helpers/atoms/atomWithAssets.ts) or the [ResourceLoader](src/loaders/ResourceLoader.ts) class. Everything has type inference.

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
> By default, the tweakpane UI is hidden unless when a query string `?debug=true` is passed.

Debug tweaks solution powered by [jotai](https://jotai.org/) and [tweakpane](https://github.com/cocopon/tweakpane).

- [Bindings](https://tweakpane.github.io/docs/input-bindings/) are created using the [`atomWithBinding`](./src/helpers/atoms/atomWithBinding.ts) atom.
- They can be added directly to the root pane or within [folders](https://tweakpane.github.io/docs/ui-components/#folder).
- The API is the same as in the official tweakpane docs, but there is an extra option to automatically listen to external updates, similar to [lil-gui's listen method](https://lil-gui.georgealways.com/#Controller#listen).

```ts
import { atomWithBinding } from '@atoms/atomWithBinding';

// Use the same store as the atom with three, or not, up to you.
const folderBinding = atomWithBinding(store, { title: 'Portal' });

export const displacement = folderBinding('Displacement', 5.0, {
  min: 0,
  max: 50,
  step: 0.1,
  listen: true,
});

displacement.get(); // => current value
displacement.sub((value) => {
  // Fires whenever the value changes
});
displacement._atom; // => the actual jotai atom
```

### Views

Just create geometries, materials, and meshes normally then add them to the scene. If you want, there is a [WebGLView](src/helpers/three/WebGLView.ts) class that can be extended to create a base view with some helpful methods. See an example in the [Experience](src/scene/Experience.ts) file.

This class extends the Three.js `Group` interface and knows how to mount the experience and add/remove itself from the scene. It also takes care of loading flags and updating the state.

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
