// import React, { useState } from 'react';
import React, { useCallback, useMemo, useRef, useState, StrictMode, useEffect } from 'react';
import axios from 'axios';

import { AgGridReact } from '@ag-grid-community/react'; // React Grid Logic
import '@ag-grid-community/styles/ag-grid.css'; // Core CSS
import '@ag-grid-community/styles/ag-theme-quartz.css'; // Theme
import { useMyContext } from 'contexts/RfqItemContex';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Create new GridExample component
const ItemDetial = ({ id }) => {
  // Row Data: The data to be displayed.
  const { rfqItemList, oprItemlist, itemCount, setSelectedRowsIds } = useMyContext();
  const [rowData, setRowData] = useState(oprItemlist);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.6:4000/rfq/${id}`);
        setRowData(response.data.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  const [colDefs, setColDefs] = useState([
    { field: 'rfq_detail_id', headerName: 'Id', filter: true },
    { field: 'rfq_item_id', headerName: 'Item Id' },
    { field: 'quantity', headerName: 'Item Qty.' }
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      flex: 1
    };
  }, []);

  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 15, 20];
  const handleSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRowsIds(selectedRows.map((obj) => obj.id));
    console.log(selectedRows.map((obj) => obj.id));
  };

  // Container: Defines the grid's theme & dimensions.
  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height: '550px' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        onSelectionChanged={handleSelectionChanged}
      />
    </div>
  );
};

export default ItemDetial;
