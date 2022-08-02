import './navigation.scss';

import gsap from 'gsap';
import React from 'react';
import { Link } from 'react-router-dom';
import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';

import { useEffectOnce, useToggle } from '@/hooks';

interface Props {
  cameraRef: React.RefObject<PerspectiveCamera>;
  controlsRef: React.RefObject<OrbitControls>;
}

const Navigation: React.FC<Props> = (props) => {
  const navRef = React.useRef<HTMLElement>(null);
  const exploreTimeline = React.useRef<GSAPTimeline>();
  const portalTimeline = React.useRef<GSAPTimeline>();

  const [uiVisible, toggleUI] = useToggle(true);

  React.useEffect(function initGsapTimelines() {
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

  React.useEffect(
    function toggleExploreMode() {
      const controls = props.controlsRef.current;
      const nav = navRef.current;
      const tl = exploreTimeline.current;

      if (!nav || !tl || !controls) return;

      if (uiVisible) {
        tl.to(controls, { duration: 0, enabled: false })
          .to(nav, { opacity: 1 })
          .to(nav, { pointerEvents: 'auto' });
      } else {
        tl.to(nav, { pointerEvents: 'none' })
          .to(nav, { opacity: 0 }, '<')
          .to(controls, { duration: 0, enabled: true });
      }
    },
    [props.controlsRef, uiVisible]
  );

  useEffectOnce(function addExitExploreModeListener() {
    const enableUI = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleUI();
      }
    };
    window.addEventListener('keydown', enableUI);

    () => window.removeEventListener('keydown', enableUI);
  });

  const playPortalAnimation = () => {
    const camera = props.cameraRef.current;
    const nav = navRef.current;
    const tl = portalTimeline.current;

    if (!nav || !tl || !camera) return;
    // Original coordinates
    const position0 = camera.position.clone();
    const rotation0 = camera.quaternion.clone();
    const position1 = new Vector3(0, 0.7, 4);
    const rotation1 = new Quaternion(0, 0, 0, 1).normalize();
    const position2 = new Vector3(0, 1, 0);
    const position3 = new Vector3(-0.6, 1.4, 0);
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

  return (
    <>
      {!uiVisible && (
        <div className="float-info">
          <span>Press ESC to Exit Free Navigation</span>
        </div>
      )}
      <nav ref={navRef} className="nav">
        <ul className="list">
          <li>
            <button type="button" onClick={playPortalAnimation}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Play Portal Animation
            </button>
          </li>

          <li>
            <button type="button" onClick={toggleUI}>
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
              Explore Scene
            </button>
          </li>

          <li>
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
              Return Home
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
