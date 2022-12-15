import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import session from '../../session/session.config';

const usePublicRestricted = () => {
  const user = session.isLoggedIn();
  if (user) return <Navigate to={user.defaultRoute} />;
  return <Outlet />;
};

const PublicRestrictedRoutes: React.FC = () => {
  const isRestricted = usePublicRestricted();

  return isRestricted;
};

export default PublicRestrictedRoutes;
