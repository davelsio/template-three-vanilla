type Cb = () => void;

interface CbHooks {
  [nameSpace: string]: {
    [eventName: string]: Array<Cb>;
  };
}
interface ResolvedName {
  original: string;
  namespace: string;
  value: string;
}

export class EventEmitter {
  private callbackHooks: CbHooks;

  constructor() {
    this.callbackHooks = {};
  }

  /**
   * Trigger the callback function associated with the specified event.
   * @param eventName name of the event listener to trigger
   */
  public emit<T extends string = string>(eventName: T): void;
  public emit<T extends string[] = string[]>(eventNames: T[]): void;
  public emit<T extends string | string[] = string | string[]>(_name: T): void {
    // Split trigger name
    const names = this.resolveNames(_name, 'Emit');

    // Resolve name
    names.map((name) => {
      // Default namespace
      if (name.namespace === 'base') {
        // Try to find callback in all namespaces
        for (const namespace in this.callbackHooks) {
          if (this.callbackHooks?.[namespace]?.[name.value]) {
            this.callbackHooks[namespace][name.value].map((callback) =>
              callback.apply(this)
            );
          }
        }
      }

      // Specified namespace
      else if (this.callbackHooks[name.namespace]) {
        this.callbackHooks[name.namespace][name.value].map((callback) =>
          callback.apply(this)
        );
      }
    });
  }

  /**
   * Sets up an event listener for the specified event(s).
   * @param name name of the event(s) to create
   * @param callback function to call when the event is triggered
   */
  public on(name: string, callback: Cb): CbHooks;
  public on(names: string[], callback: Cb): CbHooks;
  public on(_name: string | string[], callback: Cb) {
    if (!callback) {
      console.warn(
        `<On> "${_name}" event callback is invalid and will be ignored.`
      );
      return false;
    }

    const names = this.resolveNames(_name, 'On');
    names.forEach((name) => {
      // Create namespace if it does not exist
      if (!this.callbackHooks[name.namespace]) {
        this.callbackHooks[name.namespace] = {};
      }

      // Create event array if it does not exist
      if (!this.callbackHooks[name.namespace][name.value])
        this.callbackHooks[name.namespace][name.value] = [];

      // Add callback to the event callbacks array
      this.callbackHooks[name.namespace][name.value].push(callback);
    });

    return this.callbackHooks;
  }

  /**
   * Disposes off one or more event listeners and their associated callbacks.
   * @param name name of the event to dispose
   */
  public remove(name: string): CbHooks;
  public remove(names: string[]): CbHooks;
  public remove(_name: string | string[]) {
    // Resolve names
    const names = this.resolveNames(_name, 'Remove');

    // Each name
    names.forEach((name) => {
      // Remove namespace
      if (name.namespace !== 'base' && name.value === '') {
        delete this.callbackHooks[name.namespace];
      }

      // Remove specific callback in namespace
      else {
        // Default
        if (name.namespace === 'base') {
          // Find and remove from all namespaces
          for (const namespace in this.callbackHooks) {
            if (this.callbackHooks?.[namespace]?.[name.value]) {
              delete this.callbackHooks[namespace][name.value];

              // Remove namespace if it is empty
              if (Object.keys(this.callbackHooks[namespace]).length === 0)
                delete this.callbackHooks[namespace];
            }
          }
        }

        // Find and remove from the Specified namespace
        else if (this.callbackHooks[name.namespace]?.[name.value]) {
          delete this.callbackHooks[name.namespace][name.value];

          // Remove namespace if it is empty
          if (Object.keys(this.callbackHooks[name.namespace]).length === 0)
            delete this.callbackHooks[name.namespace];
        }
      }
    });

    return this.callbackHooks;
  }

  /**
   * Unregisters all event listeners and their associated callbacks.
   */
  public destroy() {
    this.callbackHooks = {};
  }

  /**
   * Returns a handler function that once invoked will remove the provided event listener.
   * @param name resolved event name
   */
  public unsubscriber(name: string) {
    return { unsubscribe: () => this.remove(name) };
  }

  /**
   * Resolves one or more composite event name to a namespace and value. A
   * namespace is provided by suffixing a name with a period. If no namespace
   * is provided, a default 'base' namespace is used.
   *
   * Example:
   *
   *  ```ts
   *    const eventName: string = 'name.namespace';
   *    resolveNames(eventName, 'Trigger');
   *    // => [ { namespace: 'namespace', value: 'name' } ]
   *
   *    const eventNames: string[] = [
   *      'name.namespace1',
   *      'name.namespace2'
   *    ];
   *    resolveNames(eventNames, 'Trigger');
   *    // => [
   *    //  {
   *    //    namespace: 'namespace1',
   *    //    value: 'name'
   *    //  },
   *    //  {
   *    //    namespace: 'namespace2',
   *    //    value: 'name'
   *    //  },
   *    //]
   *  ```
   *
   * A 'base' namespace has special consequences in 'off' and 'trigger' events.
   * When a callback is removed or triggered from a 'base' namespace, it is
   * removed from or triggered by all namespaces.
   *
   * @param eventNames name(s) of the composite event(s) including an optional namespace
   * @param opType type of event listener (for logging purposes only)
   */
  private resolveNames(
    eventNames: string | string[],
    opType: 'Remove' | 'On' | 'Emit'
  ) {
    if (!eventNames) {
      console.warn(
        `<${opType}> "${eventNames}" event listener name is invalid and will be ignored.`
      );
      return [];
    }

    const names = typeof eventNames === 'string' ? [eventNames] : eventNames;

    // Iterate each event listener name and resolve it
    const resolvedNames = names.map((_name) => {
      // Resolve the name into its constituent parts
      const parts = _name.split('.');

      const original = _name;
      const value = parts[0];
      const namespace =
        parts.length > 1 && parts[1] !== ''
          ? parts[1] // Specified namespace
          : 'base'; // Base namespace

      const resolvedName = {
        original,
        value,
        namespace,
      };

      // Verify that both the resolved event listener name and namespace are correct.
      if (!resolvedName.value) {
        console.warn(
          `<${opType}> namespaced event listener "${resolvedName.value}.
           ${resolvedName.namespace}" is invalid and will be ignored.`
        );
        return null;
      }

      return resolvedName;
    });

    // Keep only the correctly resolved event listener names.
    const filteredNames = resolvedNames.filter(
      (x): x is ResolvedName => x !== null
    );

    return filteredNames;
  }
}
