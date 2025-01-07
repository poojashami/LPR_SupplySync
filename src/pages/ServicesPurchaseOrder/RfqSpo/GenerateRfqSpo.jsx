import React from 'react';
import { Box, MenuItem, Menu } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import POView from './PoView';
import { GetPurchaseOrder, GetPaymentType } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlusButton from 'components/CustomButton';
import GenerateRfqForm from './GenerateRfqForm';

export default function QuotationPage() {
  const dispatch = useDispatch();
  const { purchaseOrder } = useSelector((state) => state.purchaseOrder);
  const [quotationData, setQuotationData] = useState([]);
  const [rfqData, setRfqData] = useState({});
  const [viewPOData, setViewPOData] = useState(false);

  const [rfqFormData, setRfqFormData] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);

  useEffect(() => {
    GetPurchaseOrder(dispatch);
    GetPaymentType(dispatch);
  }, []);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };

  const handleOpenFormClick = (data) => {
    setRfqData(data);
    setRfqFormData(true);
    setViewPOData(false);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const TableHeader = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id={`long-button-${params.row.id}`}
            aria-controls={openAction && anchorElRowId === params.row.id ? 'long-menu' : undefined}
            aria-expanded={openAction && anchorElRowId === params.row.id ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={openAction && anchorElRowId === params.row.id}
            onClose={handleCloseMenu}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem
              onClick={() => {
                handleOpenFormClick(params.row);
                handleCloseMenu();
              }}
            >
              <strong>Create Service RFQ</strong>
            </MenuItem>
          </Menu>
        </div>
      )
    },
    {
      field: 'po_num',
      headerName: 'Purchase Order No.',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: '#4680FF' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'vendor_id', headerName: 'Vendor Name', width: 150 },
    { field: 'total_cost', headerName: 'Total Amount', width: 150 },

    { field: 'po_weight', headerName: 'Weight', width: 150 },
    { field: 'unit_of_measurement', headerName: 'Unit Of Measurement', width: 150 },
    { field: 'location_to', headerName: 'Location To', width: 150 },
    { field: 'location_from', headerName: 'Location From', width: 120 },
    { field: 'dimension', headerName: 'Dimension', width: 120 },
    { field: 'created_on', headerName: 'PO Date', width: 120 }
  ];

  const handleViewClick = async (quotation) => {
    setRfqData({ ...quotation });
    setRfqFormData(false);
    setViewPOData(true);
  };

  useEffect(() => {
    const mappedData = purchaseOrder?.map((po, index) => ({
      id: index + 1,
      po_id: po.po_id,
      po_num: po.po_num,
      quo_num: po.quo_num,
      vendor_id: po.vendor_id,
      total_cost: po.total_cost,
      quo_id: po.quo_id,
      created_on: po.created_on.split('T')[0],
      status: po.status,
      po_weight: po.po_weight || '200',
      unit_of_measurement: po.unit_of_measurement || 'KG',
      location_to: po.location_to || 'Nigeria',
      location_from: po.location_from || 'India',
      dimension: po.dimension || 'N/A'
    }));

    setQuotationData(mappedData);
  }, [purchaseOrder]);

  const handleViewClose = () => {
    setRfqFormData(false);
    setViewPOData(false);
  };
  return (
    <>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {viewPOData ? (
              <span> View PO Details</span>
            ) : rfqFormData ? (
              <span>Generate Service RFQ</span>
            ) : (
              <span>Purchase Order List</span>
            )}
            {viewPOData ? (
              <span>
                <PlusButton label="Back" onClick={handleViewClose} />
              </span>
            ) : rfqFormData ? (
              <span>
                <PlusButton label="Back" onClick={handleViewClose} />
              </span>
            ) : (
              ''
            )}
          </Box>
        }
      >
        {viewPOData ? (
          <POView oprViewData={rfqData} />
        ) : rfqFormData ? (
          <GenerateRfqForm poData={rfqData} onclose={handleViewClose} />
        ) : (
          <div>
            <DataGrid getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }} rows={quotationData} columns={TableHeader} pageSize={5} rowsPerPageOptions={[5]} />
          </div>
        )}
      </MainCard>
    </>
  );
}
