I've been using this template to quickly prototype vanilla Three.js apps, for example to follow along courses and replicate tutorials. I probably spent more time on it than I ought to, but that's a different story.

Because I use typescript, [tweakpane](https://tweakpane.github.io/docs/) was the perfect match to have a debug UI. However, my template also uses [zustand](https://github.com/pmndrs/zustand) to keep a centralized state management solution and my particular case made both incompatible.

Briefly, my problem was that it is not possible pass custom binding options to tweakpane to handle read/write operations in [the configuration object](https://github.com/cocopon/tweakpane/blob/main/packages/core/src/common/binding/target.ts#L8). The default behavior bypasses zustand's `setState` action, and while using the `on('change')` event mostly works, I faced two specific problems:
1. Equality comparison functions break [when using selectors](https://github.com/pmndrs/zustand#using-subscribe-with-selector) because the previous and current values will always be the same. In other words, tweakpane first mutates the prop, then zustand sets the same value again in the change event.
2. Monitor bindings do not get updated in the UI. I'm not sure why this happens, but I assume tweakpane is not reading from the state.

I figured a number of solutions to make the two libraries compatible. Here I'd like to share my current approach using a custom plugin that adds two new configuration options, `reader` and `writer`, to the `addBinding` method from tweakpane. See the Final Words section at the end for a likely better approach.

## Example

Let's say I have a simple object that I want to control via a zustand store. In that object, two primitives are used as uniforms in a custom shader, and I want to tweak them using the debug UI.

```ts
// I could in fact create the uniform directly in this object using the `Uniform` class and it
// would probably work out of the box. But for the sake of the example and to keep things clean
// I'm going to pretend that's not an option.
export const worldSettings = {
  uvDisplacementOffset: 5.0,
  uvStrengthOffset: 5.0,
  // other props...
};
```

What I want is to be able to customize how these values are read or written by tweakpane by passing two `reader` and `writer` options. The API should be something like this:

```ts
const store = createStore(subscribeWithSelector<typeof state>(() => state));
const ui: Pane | FolderApi = /* whatever tweakpane pane or folder */
ui.addBinding(store.getState(), key, {
  ...options, // whatever binding options
  reader: (target) => store.state[target.key],
  writer: (target, value) => store.update({ [target.key]: value }),
});
````

In this case, the `store` is the created zustand store, but It could be anything else you want, these are just custom read/write options. Notice the `target` in the callback? This is the [class](https://github.com/cocopon/tweakpane/blob/main/packages/core/src/common/binding/target.ts#L8) that tweakpane uses internally to handle read/write operations to the object properties.


## Implementation

The first thing I do is destructure the default `NumberInputPlugin` from `@tweakpane/core`.

```ts
import { NumberInputPlugin as DefaultNumberInputPlugin } from '@tweakpane/core';

const {
  accept, // passes params to the binding
  api,
  binding, // defines reader and writer functions
  controller,
  core,
  id,
  type,
} = DefaultNumberInputPlugin;
```

In this case, I only need to override two configs:

- The `accept` function controls what type of value and specific options are passed to the plugin. Because we are addding two custom functions as options, we need to accept them so they reach the `binding`.
- The `binding` function contains the default `reader` and `writer` functions that determine how the value is handled. This is where we can add the functionality to read and write the zustand state.

### Accept Override

The `accept` function is pretty generic and can be made reusable across the different plugins.

```ts
import { parseRecord } from '@tweakpane/core';

/**
 * Accept function return type (not exported from `@tweakpane/core`).
 */
interface Acceptance<T, P> {
  initialValue: T;
  params: P;
}

/**
 * Accept function type (not exported from `@tweakpane/core`).
 */
type AcceptFunction<Ex, P> = {
  /**
   * @param exValue The value input by users.
   * @param params The additional parameters specified by users.
   */
  (exValue: unknown, params: Record<string, unknown>): Acceptance<Ex, P> | null;
};

/**
 * Custom accept function that extends the default by passing the custom reader
 * and writer params to the rest of the plugin chain.
 * @param accept default accept function
 */
export const customAccept = <Ex, P>(
  accept: AcceptFunction<Ex, P>
): AcceptFunction<Ex, P> => {
  return (value, params) => {
    const result = accept(value, params);
    if (result) {
      result.params = {
        ...result.params,
        ...parseRecord(params, (p) => ({
          reader: p.optional.function,
          writer: p.optional.function,
        })),
      };
    }
    return result as ReturnType<typeof accept>;
  };
};

```

As you can see, the `customAccept` function is curried to receive the default `accept` function from the plugin we are about to override. In this example we're only overriding the default `NumberInputPlugin`, but this way it can be reused for other input types.

In the code above, the relevant bit is where we define the `reader` and `writer` params, which I chose to make optional. If none are passed, we want to revert to the default behavior, as we will see next in the custom functions.

```ts
        // add the two params as optional functions
        ...parseRecord(params, (p) => ({
          reader: p.optional.function,
          writer: p.optional.function,
        })),
        // ...
```  

### Custom Reader/Writer

Creating the custom functions is quite easy in this case, since our values are just floats. Here we want to call the custom `writer` and `reader` functions, or if not defined just revert to the default `binding` method. Don't mind the custom types for now.

```ts
/**
 * Plugin type alias.
 */
type NumberInputPlugin = InputBindingPluginWithStateParams<
  typeof DefaultNumberInputPlugin
>;
type CustomReader = GetReaderType<NumberInputPlugin>;
type CustomWriter = GetWriterType<NumberInputPlugin>;

/**
 * Custom number input/monitor reader function.
 */
const getNumberReader: CustomReader = (args) => {
  const _reader = args.params.reader;
  if (!_reader) return binding.reader(args);
  return (value) => {
    return _reader(args.target, Number(value));
  };
};

/**
 * Custom number input writer function.
 */
const getNumberWriter: CustomWriter = (args) => {
  const _writer = args.params.writer;
  if (!_writer) return binding.writer(args);
  return (target, value) => {
    _writer(target, value);
  };
};
```

As you can see, `args.params` is the object that contains the custom `reader` and `writer` functions. In addition to callling those, we may need more complex logic to hande object inputs (for example, a `Color` class).

The type helpers are there to satisfy typescript, so it knows that `args.params` contains the two new optional methods.

```ts
/**
 * Input binding plugin with custom reader and writer state parameters.
 */
export type InputBindingPluginWithStateParams<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? InputBindingPlugin<In, Ex, WithStateParams<Params, Ex>>
    : never;

/**
 * Get the reader type from the binding plugin.
 */
export type GetReaderType<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? T['binding']['reader']
    : T extends MonitorBindingPlugin<infer In, infer Params>
      ? T['binding']['reader']
      : never;

/**
 * Get the writer type from the input binding plugin.
 */
export type GetWriterType<T> =
  T extends InputBindingPlugin<infer In, infer Ex, infer Params>
    ? T['binding']['writer']
    : never;

/**
 * Extend binding type args with params with custom reader and writer params.
 */
type WithStateParams<P, V> = P & {
  reader?: (target: BindingTarget, value: unknown) => V;
  writer?: (target: BindingTarget, value: V) => void;
};
```

### Custom Plugin

Now we have everything needed to create the plugin override.

```ts
export const NumberInputPlugin: NumberInputPlugin = {
  id: id + '-state', // add whatever id here, or just use the default id
  type,
  accept: customAccept(accept),
  binding: {
    constraint: binding.constraint,
    equals: binding.equals,
    reader: getNumberReader,
    writer: getNumberWriter,
  },
  controller,
  core,
  api,
};
```

We can then add that plugin to a bundle, along with any other plugin overrides.

```ts
import { TpPluginBundle } from '@tweakpane/core';

export const StateBundle: TpPluginBundle = {
  id: 'state-compatibility',
  plugins: [
    NumberInputPlugin,
    // NumberMonitorPlugin,
    // ColorNumberInputPlugin,
    // ColorObjectInputPlugin,
    // more overrides...

  ],
};
```

And register it as any other plugin.

```ts
import { Pane } from 'tweakpane';

const panel = new Pane({ title: 'Debug Options' });
panel.registerPlugin(StateBundle);
```

### Bonus

As a bonus, it is possible to have type inference for the new options in the `addBinding` method using module augmentation. Just reuse the `WithStateParams` type above. Tweakpane already allows to pass unknown options, so this is not really required.

```ts
import {
  Bindable,
  BindingApi,
  BindingParams,
  FolderApi,
} from '@tweakpane/core';

declare module '@tweakpane/core' {
  interface FolderApi {
    addBinding<T extends Bindable, K extends keyof T>(
      target: T,
      key: K,
      options?: WithStateParams<BindingParams, K>
    ): BindingApi;
  }
}
```

### Final words

Okay, maybe that was a lot. But once you get the first override going, it's quite easy to continue. The `accept` function and custom types are reusable, so keeping each plugin in its own file is maybe 60-80 lines each. Not too much.

Is there an easier way to do this? Yes, as I mentioned, it is possible to use the `on('change')` API to handle most cases. If you're not using selectors, then that's probably the smart approach.

Another possibility would be to create a custom [`BindingTarget`](https://github.com/cocopon/tweakpane/blob/main/packages/core/src/common/binding/target.ts#L8) class that overrides the `read`, `write`, and `writeProperty` methods with whatever you want. I thought about submitting an issue/PR combo to figure out if it's an option worth exploring. I imagine that implementation along the lines of a generic class:

```ts
import {
  Bindable,
  BindingTarget,
} from '@tweakpane/core';

class CustomBindingTarget<T extends Bindable, K extends keyof T> extends BindingTarget<T, K> {
  public readonly key: K;
  private readonly obj_: T;

  constructor(obj: T, key: K) {
    super();
    this.obj_ = obj;
    this.key = key;
  }
       
  public read(): T[K] {
    // read from store
  }

  public write(value: T[K]): void {
    // update store
  }

  public writeProperty(name: K, value: T[K]): void {
    // update store
  }
} 

const bindingTarget = new CustomBindingTarget(store.getState());
```

Anyway, I hope all this stuff helps someone. It's a generic read/write implementation, so the usage goes beyond zustand.

Thanks for reading so far. Let me know your thoughts or if you would do something differently.
