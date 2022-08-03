import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/home/home.routes';

const ThreejsJourney = React.lazy(
  () => import('./pages/threejs-journey/threejs-journey.routes')
);

const MainRoutes: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/threejs-journey/*" element={<ThreejsJourney />} />
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;
