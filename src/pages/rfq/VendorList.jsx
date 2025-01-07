import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { GetVendors } from 'Redux/Apis/GetApiCalls';

const VendorList = ({ setSelectedVendor, selectedVendor }) => {
  const dispatch = useDispatch();
  const { vendors } = useSelector((state) => state.vendorMaster);
  const [vendorlist, setVendorlist] = useState([]);

  // useEffect(() => {
  //   if (selectedVendor.length === 0) {
  //     // Reset selection
  //     // Note: DataGrid doesn't have a direct equivalent to deselectAll()
  //     // We'll handle this through the selectionModel prop
  //   }
  // }, [selectedVendor]);

  useEffect(() => {
    const mappedData = vendors?.map((item, index) => ({
      id: index + 1,
      vendor_id: item.vendor_id,
      vendorSeries: item.vendor_series,
      vendorName: item.vendor_name,
      contactPerson: item.contact_person,
      compliance_status: item.compliance_status
    }));
    setVendorlist(mappedData);
  }, [vendors]);

  useEffect(() => {
    GetVendors(dispatch);
  }, []);

  useEffect(() => {
    console.log('selectedVendorNew', selectedVendor);
  }, [selectedVendor]);

  const columns = [
    { field: 'id', headerName: 'Sl. No.', width: 50, flex: 1 },
    { field: 'vendorSeries', headerName: 'Vendor Code', width: 150, flex: 1 },
    { field: 'vendorName', headerName: 'Vendor Name', width: 200, flex: 1 },
    { field: 'contactPerson', headerName: 'Contact Person', width: 200, flex: 1 },
    { field: 'compliance_status', headerName: 'Compliance Status', width: 200, flex: 1 }
  ];

  const handleSelectionModelChange = (newSelectionModel) => {
    const selectedRows = vendorlist.filter((row) => newSelectionModel.includes(row.id));
    setSelectedVendor(selectedRows);
  };

  return (
    <div style={{ height: '250px', width: '100%' }}>
      <DataGrid
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': {
            border: '1px solid rgba(224, 224, 224, 1)',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center'
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f5f5f5',
            border: '1px solid rgba(224, 224, 224, 1)',
            height: '25px !important',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center'
          },
          '& .MuiDataGrid-scrollbar': {
            height: '8px'
          }
        }}
        rows={vendorlist}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        checkboxSelection
        disableSelectionOnClick
        onRowSelectionModelChange={handleSelectionModelChange}
        selectionModel={selectedVendor.map((v) => v.id)}
        hideFooterPagination
      // filterModel={{
      //   items: columns.map((col) => ({
      //     columnField: col.field,
      //     operatorValue: 'contains',
      //     value: ''
      //   }))
      // }}
      />
    </div>
  );
};

export default VendorList;
