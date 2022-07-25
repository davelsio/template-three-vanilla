import './navigation.scss';

import gsap from 'gsap';
import React from 'react';
import { Quaternion, Vector3 } from 'three';

import { CameraController } from '../../experience/controllers';

const Navigation: React.FC = () => {
  const navRef = React.useRef<HTMLElement>(null);
  const exploreTimeline = React.useRef<GSAPTimeline>();
  const portalTimeline = React.useRef<GSAPTimeline>();

  React.useEffect(() => {
    exploreTimeline.current = gsap.timeline({
      defaults: {
        duration: 0.2,
      },
    });

    portalTimeline.current = gsap.timeline({
      defaults: {
        duration: 2,
      },
    });

    return () => {
      exploreTimeline.current?.kill();
      portalTimeline.current?.kill();
    };
  }, []);

  const showPortal = () => {
    const nav = navRef.current;
    const tl = portalTimeline.current;
    if (!nav || !tl) return;

    // API
    const camera = CameraController.camera;

    // Original coordinates
    const position0 = camera.position.clone();
    const rotation0 = camera.quaternion.clone();

    const position1 = new Vector3(0, 0.7, 4);
    const rotation1 = new Quaternion(0, 0, 0, 1).normalize();

    const position2 = new Vector3(0, 1, 0.5);

    const position3 = new Vector3(-0.6, 1.4, 0.5);
    const rotation3 = new Quaternion(-0.1, -0.2, 0, 1).normalize();

    // Animation
    tl.to(nav, { duration: 0.2, opacity: 0 })
      .to(camera.position, { duration: 2, ...position1 })
      .to(camera.quaternion, { duration: 3, ...rotation1 }, '<')
      .to(camera.position, { duration: 4, ...position2 }, '-=1')
      .to(camera.position, { ...position3 })
      .to(camera.quaternion, { ...rotation3 }, '<')
      .to(camera.position, { ...position0 }, '+=1')
      .to(camera.quaternion, { ...rotation0 }, '<')
      .to(nav, { opacity: 1 });
  };

  const exploreScene = () => {
    const nav = navRef.current;
    const tl = exploreTimeline.current;
    if (!nav || !tl) return;

    const controls = CameraController.controls;

    tl.to(nav, { pointerEvents: 'none' })
      .to(nav, { opacity: 0 }, '<')
      .to(controls, { duration: 0, enabled: true })
      .to(controls, { duration: 0, enabled: false }, '+=1')
      .to(nav, { opacity: 1 })
      .to(nav, { pointerEvents: 'auto' });
  };

  return (
    <nav ref={navRef} className="nav">
      <ul className="list">
        <li>
          <button type="button" onClick={showPortal}>
            Magical Portal
          </button>
        </li>
        <li>
          <button type="button">Oil Lamps</button>
        </li>
        <li>
          <button type="button">Woodchopper{"'"}s Axe</button>
        </li>
        <li>
          <button type="button">Jagged Rocks</button>
        </li>
      </ul>

      <button type="button" className="explore" onClick={exploreScene}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>

        <span>Explore</span>
      </button>
    </nav>
  );
};

export default Navigation;
