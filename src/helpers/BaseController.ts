export abstract class BaseController<T extends {} = {}> {
  public namespace: string;

  protected _props: T;

  public constructor(namespace: string, props: T = {} as T) {
    this.namespace = namespace;
    this._props = props;
  }

  public abstract destroy(): void;
}
