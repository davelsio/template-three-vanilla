import { Route, Routes } from 'react-router-dom';

import Home from './home';

const HomeRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default HomeRoutes;
