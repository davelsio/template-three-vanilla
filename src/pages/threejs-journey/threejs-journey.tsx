import './threejs-journey.scss';
import './experience/styles/tweak-pane.scss';

import React from 'react';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-stdlib';

import { useEffectOnce } from '@/hooks';

import Navigation from './components/navigation';
import { Experience } from './experience';

const Canvas: React.FC = () => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const cameraRef = React.useRef<PerspectiveCamera | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);

  const [loaded, setLoaded] = React.useState(false);

  useEffectOnce(() => {
    const root = rootRef.current;
    let experience: Experience;
    if (root) {
      experience = new Experience(root);
      experience.onLoad(() => {
        cameraRef.current = experience.api.camera;
        controlsRef.current = experience.api.controls;
        setLoaded(true);
      });
    }

    return () => {
      if (experience) experience.destroy();
    };
  });

  return (
    <>
      {loaded && <Navigation cameraRef={cameraRef} controlsRef={controlsRef} />}
      <div ref={rootRef} className="webgl__wrapper" />
    </>
  );
};

export default Canvas;
