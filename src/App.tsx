import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import RoutesContainer from './config/routes/routes-container/RoutesContainer.route';
// import { nodeEnv } from './config/variables/system.variable';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <RoutesContainer />
      </Router>
      {/* {nodeEnv === 'development' && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  );
}

export default App;
