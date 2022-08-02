import React from 'react';

function useRoot() {
  const root = React.useMemo(() => {
    return document.querySelector<HTMLDivElement>('#root');
  }, []);

  if (!root) {
    throw Error('The index.html file must contain an element with id "root"');
  }

  return root;
}

export default useRoot;
