import { Box, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import RfqView from './rfq-view';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector, useDispatch } from 'react-redux';
import { GetRfq } from 'Redux/Apis/GetApiCalls';

export default function RFQPage() {
  const [formMode, setFormMode] = useState('create');
  const [rfqData, setRfqData] = useState([]);
  const [selectRfq, setSelectRfq] = useState();
  const [viewRfq, setViewRfq] = useState(false);

  const { rfqs } = useSelector((state) => state.rfq);
  const dispatch = useDispatch();

  useEffect(() => {
    GetRfq(dispatch);
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const TableHeader = [
    { field: 'id', headerName: 'Sl.No.', width: 25 },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="more"
            id={`long-button-${params.row.rfq_id}`}
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`long-menu-${params.row.rfq_id}`}
            MenuListProps={{
              'aria-labelledby': 'long-button'
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch'
              }
            }}
          >
            <MenuItem onClick={() => handleViewRFQ(params.row)}>View RFQ</MenuItem>
            <MenuItem onClick={() => handleActionClick(params.row)}>None</MenuItem>
          </Menu>
        </div>
      )
    },
    {
      field: 'rfq_num',
      headerName: 'RFQ Number',
      width: 120,
      renderCell: (params) => (
        <div onClick={() => handleViewRFQ(params.row)} style={{ cursor: 'pointer', color: 'blue' }} aria-hidden="true">
          {params.value}
        </div>
      )
    },
    { field: 'created_on', headerName: 'Created On', width: 250 },
    { field: 'items_count', headerName: 'Item Type Count', width: 150 },
    { field: 'delivery_timeline_in_weeks', headerName: 'Delivery Time', width: 150 },
    { field: 'port_of_destination_name', headerName: 'Port of Destination', width: 150 },
    { field: 'remarks', headerName: 'Remarks', width: 250 },
    { field: 'created_by', headerName: 'Created By' }
  ];

  const handleViewRFQ = async (quotation) => {
    setSelectRfq({ ...quotation });
    setViewRfq(true);
    handleClose();
  };

  const handleActionClick = async (quotation) => {
    handleClose();
  };

  useEffect(() => {
    const mappedData = rfqs?.map((item, index) => ({
      id: index + 1,
      key: index + 1,
      rfq_id: item.rfq_id,
      rfq_num: item.rfq_num,
      created_on: item.created_on.split('T')[0],
      items_count: item.items_count,
      created_by: item.created_by,
      vendors: item.vendors,
      deliveryTime: `${item.deliveryTime} Weeks`,
      port_of_destination_name: item.port_of_destination_name,
      remarks: item.remarks,
      req_doc_id: item.req_doc_id,
      rfq_req_doc_masters: item.rfq_req_doc_masters,
      delivery_timeline_in_weeks: item.delivery_timeline_in_weeks && `${item.delivery_timeline_in_weeks} Weeks`
    }));

    setRfqData(mappedData);
  }, [rfqs]);

  const handleCloseForm = () => {
    setViewRfq(false);
    setShowQuotationForm(false);
    setSelectedQuotation(null);
    setFormMode('create');
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
            {viewRfq ? (
              <>
                <span>
                  View RFQ No. <b style={{ color: 'blue' }}>({selectRfq.rfq_num})</b>
                </span>
                <Button color="primary" variant="contained" size="small" onClick={handleCloseForm}>
                  Back
                </Button>
              </>
            ) : (
              <span>RFQ List</span>
            )}
          </Box>
        }
      >
        {viewRfq ? (
          <>
            <RfqView rfq={selectRfq} formMode={formMode} onClose={handleCloseForm} onFormSubmit={handleFormSubmit} />
          </>
        ) : (
          <>
            <Box sx={{ maxHeight: '80vh', width: '100%' }}>
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
                rows={rfqData}
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
