import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../../modules';

const NonRestrictedRoutes: React.FC = () => {
  return (
    <div className="blue-theme h-screen bg-gradient-to-tl from-primaryDark to-primary text-text">
      <div className="h-full flex flex-col">
        <Header />
        <div className="w-fill h-fill overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default NonRestrictedRoutes;
