import './threejs-journey.scss';
import './experience/styles/tweak-pane.scss';

import React from 'react';

import { useEffectOnce } from '@/hooks';

import Navigation from './components/navigation';
import { Experience } from './experience';

const Canvas: React.FC = () => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  useEffectOnce(() => {
    const root = rootRef.current;
    let experience: Experience;
    if (root) {
      experience = new Experience(root);
      experience.onLoad(() => setLoaded(true));
    }

    return () => {
      if (experience) experience.destroy();
    };
  });

  return (
    <>
      {loaded && <Navigation />}
      <div ref={rootRef} className="webgl__wrapper" />
    </>
  );
};

export default Canvas;
