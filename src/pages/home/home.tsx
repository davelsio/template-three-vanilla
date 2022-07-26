import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import reactLogo from './assets/react.svg';
import threejsLogo from './assets/threejs.svg';

const Home: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="home__container">
      <div className="home__logos">
        <a href="https://vitejs.dev/" target="_blank" rel="noreferrer">
          <img src="/vite.svg" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
          <img src={reactLogo} alt="React logo" />
        </a>
        <a href="https://threejs.org/" target="_blank" rel="noreferrer">
          <img src={threejsLogo} alt="Three.js logo" />
        </a>
      </div>

      <h1>Vite + React + Three.js</h1>

      <button
        className="home__button"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>

      <div className="home__card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>

        <p>Click on the Vite and React logos to learn more</p>
      </div>

      <Link to="/threejs-journey" className="home__button">
        Go to Experience
      </Link>
    </div>
  );
};

export default Home;
