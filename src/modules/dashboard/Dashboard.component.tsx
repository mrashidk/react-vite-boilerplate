import { DataLoadingOverlay } from '../common/components';

const Dashboard = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <DataLoadingOverlay isLoading />
      Dashboard
    </div>
  );
};

export default Dashboard;
