import _zustand from 'zustand';

declare module 'zustand/middleware' {
  type StoreSubscribeWithSelector<T> = {
    subscribe: {
      (
        listener: (selectedState: T, previousSelectedState: T) => void
      ): () => void;
      <U>(
        selector: (state: T) => U,
        listener: (selectedState: U, previousSelectedState: U) => void,
        options?: {
          equalityFn?: (a: U, b: U) => boolean;
          fireImmediately?: boolean;
          unique?: boolean; // custom
        }
      ): () => void;
    };
  };

  type Write<T, U> = Omit<T, keyof U> & U;
}
