import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';

const Home = () => {
  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: 'test 1',
      field: 'test1',
      filter: true,
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
    },
    {
      headerName: 'test 2',
      field: 'test1',
      filter: true,
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
    },
    {
      headerName: 'test 3',
      field: 'test1',
      filter: true,
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
    },
    {
      headerName: 'test 4',
      field: 'test1',
      filter: true,
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
    },
    {
      headerName: 'test 5',
      field: 'test1',
      filter: true,
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
    },
  ]);

  return (
    <div className="w-fill z-10 p-4 h-[92vh] overflow-y-auto">
      <div className="ag-theme-alpine-dark p-5 w-full h-full">
        <div className="font-bold text-base mb-2">Test table</div>
        <AgGridReact
          className="opacity-95 pb-1"
          // ref={gridRef}
          rowData={[]}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            resizable: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            autoHeight: true,
          }}
          enableCellTextSelection
          tooltipShowDelay={0}
          // tooltipHideDelay={20000}
          animateRows
          rowSelection="multiple"
          overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Please wait while data is loading</span>'}
        />
      </div>
    </div>
  );
};

export default Home;
