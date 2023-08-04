import React from 'react';
import { Location, Navigate, NavigateFunction, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../../modules';
import session from '../../session/session.config';
import { useThemeStore } from '../../hooks';

const useAuth = (navigate: NavigateFunction, location: Location) => {
  const { theme } = useThemeStore();
  const user = localStorage.getItem('currentUser');
  if (user) {
    const isRouteAuthenticated = session.authenticateRoute(window.location.pathname);
    if (typeof isRouteAuthenticated === 'boolean' && !isRouteAuthenticated) {
      navigate('/', { replace: true, state: { from: location } });
    } else if (typeof isRouteAuthenticated === 'string') return <Navigate to={isRouteAuthenticated} />;
    return (
      <div className={`${theme} h-screen bg-gradient-to-tl from-primaryDark to-primary text-text`}>
        <div className="h-full flex flex-col">
          <Header />
          <div className="w-fill h-fill overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
  return <Navigate to="/" state={{ from: location }} replace />;
};

const ProtectedRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuth(navigate, location);

  return isAuthenticated;
};

export default ProtectedRoutes;
