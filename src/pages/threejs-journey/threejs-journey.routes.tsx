import { Route, Routes } from 'react-router-dom';

import ThreejsJourney from './threejs-journey';

const ThreejsJourneyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ThreejsJourney />} />
    </Routes>
  );
};

export default ThreejsJourneyRoutes;
