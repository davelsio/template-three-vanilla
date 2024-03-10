
## Description

Custom vanilla Three.js template based on the Code Structuring for Bigger Projects lesson from [Three.js Journey](https://threejs-journey.com/).

This is just a for-fun project that I use it to quickly prototype WebGL experiences when following courses or replicating tutorials. For any other use case, I would recommend to use the excellent [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and [pmndrs/drei](https://github.com/pmndrs/drei) libraries.

The current experience is an old project from when I started to learning Three.js and WebGL. Maybe I'll add a more comprehensive example in the future. The debug UI only shows up in the `/debug` route.

### Features

- Codebase architecture loosely based on a weird MVC-Flux hybrid pattern.
- Zustand for state management.
- Tweakpane implementation compatible with state management.
- Typescript for type safety.
- Sensible ESLint and Prettier configurations.

 
## Architecture

<details>
<summary>TODO</summary>
- Add a diagram explaining what is going on.
- Add links to the `controllers`, `state`, and `views` folders.
</details>

I did not want the project codebase to become too unwieldy by allowing the scene views and various controllers (renderer, camera, etc.) to import and call each other's methods indiscriminately.

To manage that type of communication, I divided the experience in three layers:
- Controllers: these initialize the experience and handle things such as camera, renderer, stage, and world behavior.
- Views: these are the scene objects created by the World controller and loaded as asynchronous entities. This approach decouples the resource loading stage. Each view notifies the central state when the loading is done so state subscribers can react accordingly.
- Communication between Controllers and Views is handled via a centralize Store layer.

## State Management

<details>
<summary>TODO</summary>
- Add links to the `settings` and `debug` folders.
</details>

State management is handled with [zustand](https://github.com/pmndrs/zustand), with additional support for subscriptions with selectors. Each controller implements its own state management and all stores are exposed from a central `Store` class.

In addition, I added a custom debug UI implementation using [tweakpane](https://github.com/cocopon/tweakpane) that is type-safe and integrates within the state management. Subscription to the UI changes is therefore handled as any other zustand subscription.

## Develop

<details>
<summary>TODO</summary>
- Add links to the `src/Experience` and root `index` files.
</details>

This project was created with [pnpm](https://pnpm.io), but any other package manager will work. Bundling is handled with [Vite](https://vitejs.dev).

### Commands
```shell
pnpm install # install package dependencies
pnpm dev     # start development server
pnpm lint    # [--fix] lint files
```
