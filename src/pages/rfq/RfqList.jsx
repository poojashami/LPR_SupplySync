import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import PlusButton from 'components/CustomButton';
import OprItemList from './OprItemList';
import GenerateRfqPage from './GenerateRfqPage';

const RfqList = () => {
  const [showOprItemList, setShowOprItemList] = useState(false);
  const [generateRFQ, setGenerateRFQ] = useState(false);

  const rfqColumn = [
    {
      field: 'opr_num',
      headerName: 'OPR No.',
      renderCell: (params) => (
        <div style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      ),
      width: 120
    },
    { headerName: 'Vertical', field: 'vertical_name', width: 120 },
    { headerName: 'Company', field: 'company_name', width: 120 },
    { headerName: 'Division', field: 'division_name', width: 120 },
    { headerName: 'OPR Category', field: 'opr_description', width: 150 },
    { headerName: 'Shipment Mode', field: 'shipment_mode_name', width: 120 },
    { headerName: 'Buying From', field: 'buy_from', width: 120 },
    { headerName: 'Buying House', field: 'buying_house_name', width: 120 },
    { headerName: 'Left for RFQ', field: 'remaining_item_count', width: 120 },
    { headerName: 'Delivery Time', field: 'd_timeline_name', width: 120 },
    { headerName: 'Requested By Department', field: 'dept_name', width: 180 },
    { headerName: 'Requested By', field: 'requested_by', width: 120 },
    { headerName: 'Date', field: 'opr_date', width: 120 },
    { headerName: 'Additional Remarks', field: 'remarks', width: 150 }
  ];

  const rfqData = [
    {
      id: 1,
      opr_num: 'OPR-001',
      vertical_name: 'Sales',
      company_name: 'ABC Corp',
      division_name: 'North Division',
      opr_description: 'Electronics',
      shipment_mode_name: 'Air',
      buy_from: 'Domestic',
      buying_house_name: 'XYZ Traders',
      remaining_item_count: 5,
      d_timeline_name: '30 Days',
      dept_name: 'Procurement',
      requested_by: 'John Doe',
      opr_date: '2025-01-10',
      remarks: 'Urgent requirement'
    },
    {
      id: 2,
      opr_num: 'OPR-002',
      vertical_name: 'Marketing',
      company_name: 'DEF Corp',
      division_name: 'West Division',
      opr_description: 'Furniture',
      shipment_mode_name: 'Sea',
      buy_from: 'International',
      buying_house_name: 'LMN Supplies',
      remaining_item_count: 10,
      d_timeline_name: '45 Days',
      dept_name: 'Logistics',
      requested_by: 'Jane Smith',
      opr_date: '2025-01-08',
      remarks: 'Standard delivery time'
    }
  ];

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {showOprItemList ? (generateRFQ ? 'Generate RFQ' : 'Create RFQ - Item List in Selected OPR') : 'Create RFQ - Pending OPR List'}
          </span>
          <div>
            <PlusButton
              label={showOprItemList ? 'Back' : 'Proceed'}
              onClick={() => {
                !generateRFQ && setShowOprItemList(!showOprItemList);
                setGenerateRFQ(false);
              }}
            />
            {showOprItemList && !generateRFQ && <PlusButton label={'Proceed'} onClick={() => setGenerateRFQ(!generateRFQ)} />}
          </div>
        </Box>
      }
    >
      <Box sx={{ width: '100%' }}>
        {showOprItemList ? (
          generateRFQ ? (
            <GenerateRfqPage />
          ) : (
            <OprItemList showItems={showOprItemList} setShowItems={setShowOprItemList} />
          )
        ) : (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-cell': {
                border: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex'
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f5f5f5',
                border: '1px solid rgba(224, 224, 224, 1)',
                height: '25px !important',
                display: 'flex'
              },
              '& .MuiDataGrid-checkboxInput': {
                padding: '0px' // To remove extra padding around the checkbox
              },
              '& .MuiCheckbox-root': {
                width: '18px',
                height: '18px'
              },
              '& .MuiSvgIcon-root': {
                fontSize: '20px' // Customize the size of the checkmark icon
              }
            }}
            rows={rfqData}
            columns={rfqColumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            hideFooter
            checkboxSelection
          />
        )}
      </Box>
    </MainCard>
  );
};

export default RfqList;
