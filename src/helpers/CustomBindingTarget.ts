// import { Settings } from '@controllers/Debug';
// import { BindingTarget } from '@tweakpane/core';
//
// import { StoreInstance } from './StoreInstance';

// export class CustomBindingTarget<
//   T extends Settings,
//   S extends StoreInstance<T>,
// > extends BindingTarget<T, keyof T> {
//   private _store: S;
//
//   constructor(store: S, key: keyof T) {
//     super(store.state, key);
//     this._store = store;
//   }
//
//   public read() {
//     return this._store.state[this.key];
//   }
//
//   public write(value: T[keyof T]) {
//     const state = { [this.key]: value } as Partial<T>;
//     this._store.update(state);
//   }
// }
