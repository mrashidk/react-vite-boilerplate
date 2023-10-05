import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../../modules';
import { useThemeStore } from '../../hooks';

const NonRestrictedRoutes: React.FC = () => {
  const { theme } = useThemeStore();

  return (
    <div className={`${theme} h-screen bg-gradient-to-tl from-primaryDark to-primary text-text`}>
      <div className="h-full flex flex-col">
        <Header />
        <div className="overflow-y-auto flex flex-col flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default NonRestrictedRoutes;
