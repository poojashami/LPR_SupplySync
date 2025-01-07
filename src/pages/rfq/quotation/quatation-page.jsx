import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import QuotationForm from './quotation-form';
import QuotationView from './view';
import { GetQuotation } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

export default function QuotationPage() {
  const dispatch = useDispatch();
  const { quotations } = useSelector((state) => state.quotation);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [quotationData, setQuotationData] = useState([]);
  const [quotationItems, setQuotationItems] = useState(null);

  useEffect(() => {
    GetQuotation(dispatch);
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };

  const handleActionClick = async () => {
    // Your action logic here
    handleClose();
  };

  const TableHeader = [
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
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem onClick={() => handleViewClick(params.row)}>
              <VisibilityIcon style={{ fontSize: 18, marginRight: '8px', color: 'grey' }} />
              View
            </MenuItem>
            <MenuItem onClick={() => handleActionClick(params.row)}>
              {' '}
              <EditIcon style={{ fontSize: 18, marginRight: '8px', color: 'blue' }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleActionClick(params.row)}>
              {' '}
              <DeleteIcon style={{ fontSize: 18, marginRight: '8px', color: 'red' }} /> Delete
            </MenuItem>
          </Menu>
        </div>
      )
    },
    { field: 'quo_id', headerName: 'Quotation ID', width: 100 },
    {
      field: 'quo_num',
      headerName: 'Quotation Number',
      width: 150,
      renderCell: (params) => (
        <div onClick={() => handleViewClick(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'rfq_num', headerName: 'RFQ Number', width: 150 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 150 },
    { field: 'referenceDate', headerName: 'RFQ Generate Date ', width: 150 },
    { field: 'quo_date', headerName: 'Quotation Date', width: 150 },
    { field: 'currency', headerName: 'Currency', width: 150 },
    { field: 'delivery_terms', headerName: 'Delivery Terms', width: 150 },
    { field: 'country_origin', headerName: 'Country of Origin', width: 150 },
    { field: 'country_supply', headerName: 'Country of Supply', width: 150 },
    { field: 'port_loading', headerName: 'Port of Loading', width: 150 },
    { field: 'lead_time', headerName: 'Lead Time', width: 150 },
    { field: 'payment_terms', headerName: 'Payment Terms', width: 250 },
    { field: 'remarks', headerName: 'Remarks', width: 250 },
    { field: 'total_cost', headerName: 'Total Cost', width: 80 }
  ];

  const handleViewClick = async (quotation) => {
    setQuotationItems({ ...quotation });
    handleClose();
  };

  useEffect(() => {
    const mappedData = quotations?.map((item, index) => ({
      ...item,
      id: index + 1,
      quo_id: item.quo_id,
      quo_num: item.quo_num,
      rfq_id: item.rfq_id,
      rfq_num: item.reference_no,
      vendor_name: item.VendorsMaster.vendor_name,
      referenceDate: item.reference_date,
      quo_date: item.quo_date,
      currency: item.currency,
      delivery_terms: item.delivery_terms_name,
      country_origin: item.country_origin,
      country_supply: item.country_supply,
      port_loading: item.port_loading,
      lead_time: item.lead_time,
      payment_terms: item.payment_terms,
      remarks: item.remarks,
      total_cost: item.total_cost,
      quotation_items: item.quotation_items,
      QuoDocs: item.QuoDocs,
      additional_costs: item.additional_costs,
      quo_require_docs: item?.quo_require_docs
    }));

    setQuotationData(mappedData);
  }, [quotations]);

  const handleCloseForm = () => {
    setShowQuotationForm(false);
    setSelectedQuotation(null);
    setFormMode('create');
  };
  const handleViewClose = () => {
    setQuotationItems(null);
  };
  const handleFormSubmit = async () => {
    await GetQuotation(dispatch);
    setShowQuotationForm(false);
  };

  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!showQuotationForm ? <span>Quotation List</span> : <span>Create Quotation</span>}

            {/* {!showQuotationForm ? (
              <Button color="primary" variant="contained" className="plus-btn-color" onClick={handleCreateOpr}>
                + Create Quotation
              </Button>
            ) : (
              <Button color="primary" className="plus-btn-color" onClick={handleCloseForm}>
                Back
              </Button>
            )} */}
          </Box>
        }
      >
        {showQuotationForm ? (
          <QuotationForm user={selectedQuotation} formMode={formMode} onClose={handleCloseForm} onFormSubmit={handleFormSubmit} />
        ) : quotationItems ? (
          <QuotationView oprViewData={quotationItems} onClose={handleViewClose} />
        ) : (
          <>
            <Box sx={{ minHeight: '20vh', width: '100%' }}>
              <DataGrid
                getRowHeight={() => 'auto'}
                sx={{
                  minHeight: '70vh',
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f5f5f5',
                    border: '1px solid rgba(224, 224, 224, 1)',
                    height: '25px !important',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  },
                  '& .MuiDataGrid-scrollbar': {
                    height: '8px'
                  }
                }}
                rows={quotationData}
                columns={TableHeader}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </Box>
          </>
        )}
      </MainCard>
    </>
  );
}
