/**
 * Adapted from Niall Crosby
 * https://blog.ag-grid.com/avoiding-react-18-double-mount/
 * https://dev.to/ag-grid/react-18-avoiding-use-effect-getting-called-twice-4i9e
 */
import React from 'react';

export default function useEffectOnce(effect: () => void | (() => void)) {
  const cleanupFunction = React.useRef<void | (() => void)>();
  const calledOnce = React.useRef(false);
  const renderedAfterCalled = React.useRef(false);
  const [, refresh] = React.useState<number>(0);

  if (calledOnce.current) {
    renderedAfterCalled.current = true;
  }

  React.useEffect(() => {
    /**
     * Only execute the effect the first time the component mounts.
     * It will also ignore the second dummy render in React 18.
     */
    if (!calledOnce.current) {
      cleanupFunction.current = effect();
      calledOnce.current = true;
    }

    /**
     * Force a re-render after the effect is run, so that the
     * cleanup function is fired on the second unmount.
     */
    refresh(1);

    return () => {
      /**
       * Only call the cleanup function after the first unmount.
       */
      if (!renderedAfterCalled.current) return;
      if (cleanupFunction.current) cleanupFunction.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
