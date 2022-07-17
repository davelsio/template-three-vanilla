import { Route, Routes } from 'react-router-dom';

import Home from './pages/home/home.routes';
import ThreejsJourney from './pages/threejs-journey/threejs-journey.routes';

const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/threejs-journey/*" element={<ThreejsJourney />} />
    </Routes>
  );
};

export default MainRoutes;
