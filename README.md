## Description

I started developing this vanilla Three.js template after watching the Code Structuring for Bigger Projects lesson from [Three.js Journey](https://threejs-journey.com/). I liked the idea so much that it quickly became a fun project for me to prototype WebGL experiences when following courses or replicating tutorials.

Recently, I went back to the course to take the new shader lessons and I wanted to refresh this template with a new spin that does away with the OOP concept and leverages `jotai` atoms instead. It's hardly complete, but I keep tweaking things as I find new use cases, so it continues to evolve.

The example experience is the final project from Three.js Journey, my very first complex scene from when I started learning Three.js and WebGL. In the future, I'd love to add a more interesting example that makes extensive use of shaders.

### Features

- Atom-based architecture to manage scene state.
- Modular state management implementation using [Jotai](https://jotai.org).
- Custom [Tweakpane](https://tweakpane.github.io/docs/) implementation integrated with Jotai.
- Sensible Typescript, ESLint, and Prettier configurations.

### Architecture

I did not want the project codebase to become too unwieldy by allowing the scene views and various controllers (renderer, camera, etc.) classes to import and call each other's methods indiscriminately.

To manage that type of communication, I've encapsulated the experience in various atoms. For example there is an [`atomWithThree`](./src/atoms/atomWithThree.ts) that takes care of initializing a Three.js instance that can be reused on various scenes, or an [`atomWithAssets`](./src/atoms/atomWithAssets) that provides type safety and asynchronous asset loading. All atoms can be found in the [`atoms/`](./src/atoms) folder. 

For now, the scenes still use an OOP approach. I have an abstract [`WebGLView`](./src/helpers/three/WebGLView.ts) that provides various convenience methods, like subscribing to atoms or initializing/disposing the view. This class and a few other helper classes and functions can be found in the [`helpers`](./src/helpers) folder.

### Debug Panels

> [!NOTE]
> The debug UI only shows up in the `/debug` route.

I wanted to have a unified solution that handled both internal state and various configurable settings/tweaks. Because this is a typescript codebase, I decided on a custom implementation [tweakpane](https://github.com/cocopon/tweakpane) implementation that is type-safe and integrates with the Jotai store. Different debug tweaks can be added using the [`atomWithBinding`](./src/atoms/atomWithBinding.ts) atom. Subscription to UI changes is handled as any other atom subscription.

Both tweakpane [folders](https://tweakpane.github.io/docs/ui-components/#folder) and regular [input/monitor bindings](https://tweakpane.github.io/docs/input-bindings/) use the same APIs described in the official tweakpane docs. I've also added a QoL improvement to automatically listen to updates and refresh the binding accordingly, similarly to [lil-gui listen method](https://lil-gui.georgealways.com/#Controller#listen).

#### Atom signatures

```ts
import { BindingParams, FolderParams } from "@tweakpane/core";

type AtomWithTweakOptions = BindingParams & {
  /**
   * Automatically refresh the tweakpane UI when the atom changes.
   */
  listen?: boolean;
  /**
   * Routes in which the tweak should be visible.
   * Defaults to all routes.
   */
  paths?: string[];
};

type AtomWithBinding = <T>(label: string, value: T, options?: AtomWithTweakOptions) => WritableAtom<T, [arg: T], void>;
type AtomWithBindingFolder = (store: Store, folderParams: FolderParams) => AtomWithBinding;
```

#### Example state with tweakpane bindings for the portal

```ts
// ./src/scene/PortalState.ts

import type {Store} from '@helpers/three'
import {atomWithBinding} from '@atoms/atomWithBinding';
import {portalState} from "./PortalState";

// Helper that creates a scoped Jotai store, calls atomWithThree, and provides
// a few convenience helpers used by the `WebGLView` abstract class.
export const portalState = createThreeState();

const portalFolderBinding = atomWithBinding(portalState.store, {title: 'Portal'});

export const portalDisplacementAtom = portalFolderBinding('Displacement', 5.0, {
  min: 0,
  max: 50,
  step: 0.1,
});
```

## Develop

This project was created with [pnpm](https://pnpm.io), but any other package manager will work. Bundling is handled by [Vite](https://vitejs.dev).

### Commands

```shell
pnpm install # install package dependencies
pnpm dev     # start development server
pnpm lint    # [--fix] lint files
```

## Usage

As I mentioned in the description, this project is mostly for development fun. In production, I'd rather use [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and [pmndrs/drei](https://github.com/pmndrs/drei). However, it should be easy to integrate it within other codebases. A Three.js experience can be started by either initializing the `atomWithThree` atom, or calling the `createThreeState` helper method.

```ts
import { atomWithThree } from '@atoms/atomWithThree';

import '@styles/reset.css';
import '@styles/webgl.css';
import '@styles/tweakpane.css';

export const [
  threeAtom, // camera, controls, renderer, scene, stage
  vpAtom,    // viewport
  timeAtom,  // time
] = atomWithThree('#root'); // container element for the canvas

// Do whatever with the experience atoms
```

The experience is separated in three atoms (more could be added as needed).
- `threeAtom`: contains the camera, controls, renderer, and scene `controllers`, which I assume in most circumstances won't change.
- `vpAtom`: part of an `atomFamily` based on the container selector, it manages resize events for the provided container
- `timeAtom`: hooked to the `gsap.ticker` function, it manages tick events.

From there it's up to you whether to use the `WebGLView` class. However, note that this class depends on passing a `state` object derived from the `createThreeState` helper. This is a work in progress.

### Views

To keep things tidy, I've put the scene in the [`scene/`](src/scene) folder, but this is completely arbitrary. This folder is just an example of an actual implementation.

To create a view, I just extend the [WebGLView](src/helpers/three/WebGLView.ts) class. This class extends the Three.js `Group` interface and knows how to add and remove itself from the experience. It also takes care of setting the loading flags and updating the state. Unfortunately, to make this bit of magic work, I needed to drill a custom state instance that provides a few helper methods. It is also required to preserve the class `this` context, so make sure all the class methods are arrow functions.

Different scenes can be created and will reuse the initialized Three.js atom instance. Most of the time, when I start a project, I just delete the scenes and clear the default state. Then I can start creating the new views and adding whatever tweaks I need.

### Resources

To load textures and models I use an [atomWithAssets](./src/atoms/atomWithAssets.ts) helper that uses a [ResourceLoader](src/loaders/ResourceLoader.ts) helper class under the hood. Some things to note:

- Both the atom and helper class infer types from the assets passed in the params.
- The DRACO decoder is included within the [public](public) folder, taken as is from `three/examples/js/libs/draco/`.

#### Example

```ts
// index.ts (or wherever to initialize)
import {
  CubeTextures,
  DataTextures,
  GLTFModels,
  Textures,
} from '@loaders/assets';

import { ResourceLoader } from '@loaders/ResourceLoader';

ResourceLoader.init(CubeTextures, DataTextures, Textures, GLTFModels, {
  draco: true,
});

// Somewhere else...
const texture = await ResourceLoader.loadTexture('textureName')
```

Or alternatively,

```ts
// index.ts (or wherever to initialize)
export const { gltfsFamily, texturesFamily } = atomWithAssets(
  portalState.store,
  {
    textures: {
      portalBakedTexture: 'baked.jpg',
    },
    gltfs: {
      portalModel: 'portal.glb',
    },
    options: {
      draco: true,
    },
  }
);

// Somewhere else...
const gltf = await store.get(gltfsFamily('modelName'));
```

### Styles

Some optional css styles are provided that work well with a stand-alone project.

- `reset.css`: Pretty much a copy-paste from the amazing Josh Comeau [custom CSS reset](https://www.joshwcomeau.com/css/custom-css-reset/). This one also removes default `padding` and button `border`.
- `webgl.css`: Applies only the WebGL `canvas` to remove it from the document flow and create its own stacking context. Regardless of this CSS, the experience will always respect the parent container dimensions, whether it is the document or some other element.
- `tweakpane.css`: Adds some extra width to the main debug pane and slightly adjusts the label:input width proportion of each binding blade so the input takes the majority of the available space.
