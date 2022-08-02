import _zustand from 'zustand';

declare module 'zustand/middleware' {
  type StoreSubscribeWithSelector<T extends object> = {
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
        }
      ): () => void;
    };
  };

  type Write<T extends object, U extends object> = Omit<T, keyof U> & U;
}
