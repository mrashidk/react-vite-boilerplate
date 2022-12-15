import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoutes, PublicRestrictedRoutes } from '..';
import { Home, Login } from '../../../modules';
import ErrorPage from '../../../modules/error-page/ErrorPage.component';
import NonRestrictedRoutes from '../non-restricted-routes/NonRestrictedRoutes.route';

const RoutesContainer: React.FC = () => {
  return (
    <Routes>
      <Route element={<PublicRestrictedRoutes />}>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<NonRestrictedRoutes />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default RoutesContainer;
