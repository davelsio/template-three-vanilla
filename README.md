## Description

I started developing this vanilla Three.js template after watching the Code Structuring for Bigger Projects lesson from [Three.js Journey](https://threejs-journey.com/). I liked the idea so much that it quickly became a fun project for me to prototype WebGL experiences when following courses or replicating tutorials.

Recently, I went back to the course to take the new shader lessons and I wanted to refresh this template with a new spin that does away with the OOP concept and leverages `jotai` atoms instead. It's hardly complete, but I keep tweaking things as I find new use cases, so it continues to evolve.

The example experience is the final project from Three.js Journey, my very first complex scene from when I started learning Three.js and WebGL. In the future, I'd love to add a more interesting example that makes extensive use of shaders. The debug UI only shows up in the `/debug` route.

### Features

- Atom-based architecture to manage scene state.
- Centralized state management implementation using [Jotai](https://jotai.org).
- Custom [Tweakpane](https://tweakpane.github.io/docs/) implementation integrated with Jotai.
- Sensible Typescript, ESLint, and Prettier configurations.

### Architecture

I did not want the project codebase to become too unwieldy by allowing the scene views and various controllers (renderer, camera, etc.) classes to import and call each other's methods indiscriminately.

To manage that type of communication, I've encapsulated the experience in various atoms. To make it easier to initialize a generic Three.js instance that can be reused on various scenes, I've included an [`atomWithThree`](./src/atoms/atomWithThree.ts) that takes care of the whole thing. All atoms can be found in the [`atoms/`](./src/atoms) folder.

For now, Scenes still use an OOP approach. For convenience, I have an abstract [`WebGLView`](./src/helpers/classes/WebGLView.ts) that provides various convenience methods, like subscribing to atoms or initializing/disposing the view. I figure the whole OOP stuff will eventually go away and I'll just rely on helper functions. Resource handling also uses a static class for the moment. This will soon change to individual atoms behaviors.

### Debug Panels

> [!NOTE]
> The debug UI only shows up in the `/debug` route.

I wanted to have a unified solution that handled both internal state and various configurable settings/tweaks. Because this is a typescript codebase, I added a custom implementation for [tweakpane](https://github.com/cocopon/tweakpane) that is type-safe and integrates with the state management store. Different debug tweaks can be added using the [`atomWithBinding`](./src/atoms/atomWithBinding.ts) and [`atomWithBindingFolder`](./src/atoms/atomWithBinding.ts) atoms. Subscription to UI changes is handled as any other atom subscription.

Both tweakpane [folders](https://tweakpane.github.io/docs/ui-components/#folder) and regular [input/monitor bindings](https://tweakpane.github.io/docs/input-bindings/) use the same APIs described in the official tweakpane docs. I've also added a QoL improvement to automatically listen to updates and refresh the binding accordingly, similarly to [lil-gui listen method](https://lil-gui.georgealways.com/#Controller#listen).

#### AtomWithBinding signature

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
type AtomWithBindingFolder = (folderParams: FolderParams) => AtomWithBinding;
```

### Example state with tweakpane bindings for the portal

```ts
// ./src/state/portal/portal.ts

import { atomWithBindingFolder } from '@atoms/atomWithBinding';

const portalFolderBinding = atomWithBindingFolder({ title: 'Portal' });

export const portalDisplacementAtom = portalFolderBinding('Displacement', 5.0, {
  min: 0,
  max: 50,
  step: 0.1,
});
```

## Develop

This project was created with [pnpm](https://pnpm.io), but any other package manager will work. Bundling is handled with [Vite](https://vitejs.dev).

### Commands

```shell
pnpm install # install package dependencies
pnpm dev     # start development server
pnpm lint    # [--fix] lint files
```

## Usage

As I mentioned in the description, this project is mostly for development fun. In production, I'd rather use [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and [pmndrs/drei](https://github.com/pmndrs/drei). However, it should be easy to integrate it within other codebases. The experience can be started by initializing the `atomWithThree` atom.

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

From there it's up to you whether to use the WebGLView and ResourceLoader classes. Since I plan on removing all OOP abstractions, I'll document the new atoms/helpers once that is done.

### Views

To keep things tidy, I've put the scene in the [`scene/`](src/scene) folder, but this is completely arbitrary. This folder is just an example of an actual implementation.

To create a view, I just extend the [WebGLView](src/helpers/classes/WebGLView.ts) class. This class extends the Three.js `Group` interface and knows how to add and remove itself from the experience. It also takes care of setting the loading flags and updating the state. Unfortunately, to make this bit of magic work, it is necessary to preserve the class `this` context, so I have to make sure all the methods are arrow functions.

Different scenes can be created and will reuse the existing initialize Three.js atom instance. Most of the time, when I start a project, I just delete the scenes and clear the default state. Then I can start creating the new views and adding whatever tweaks I need.

### Resources

To load textures and models, I've created a [ResourceLoader](src/loaders/ResourceLoader.ts) class that exposes various static methods. Some things to note:

- This class imports any resources declared in the [assets](src/loaders/assets.ts) file. The assets are fully typed and the static methods will use those types.
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
const texture = await ResourceLoader.loadTexture('typedTextureName')
```

### Styles

Some optional css styles are provided that work well with a stand-alone project.

- `reset.css`: Pretty much a copy-paste from the amazing Josh Comeau [custom CSS reset](https://www.joshwcomeau.com/css/custom-css-reset/). This one also removes default `padding` and button `border`.
- `webgl.css`: Applies only the WebGL `canvas` to remove it from the document flow and create its own stacking context. Regardless of this CSS, the experience will always respect the parent container dimensions whether it is the document or some other element.
- `tweakpane.css`: Adds some extra width to the main debug pane and sligthly adjusts the label:input width proportion of each binding blade, so that the input takes the majority of the available space.
