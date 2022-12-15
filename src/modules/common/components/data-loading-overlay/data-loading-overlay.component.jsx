/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
import './data-loading-overlay.css';

const DataLoadingOverlay = ({ isLoading, showText = true, zIndex = 10000, title = 'Loading Data...' }) => (
  <>
    {isLoading && (
      <div className="data-loading-overlay text-align-center" style={{ zIndex }}>
        <div className="animate-ping flex items-center justify-center h-[90vh]">
          <img src="vite.svg" className="" alt="" />
        </div>
      </div>
    )}
  </>
);

export default DataLoadingOverlay;
