import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import MainCard from 'components/MainCard';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import ApprovalView from './ApprovalView';
import PlusButton from 'components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { GetCIList } from 'Redux/Apis/GetApiCalls';

const ApprovalPending = () => {
  const dispatch = useDispatch();
  const { ci_list, isFetching } = useSelector((state) => state.purchaseOrder);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRowId, setAnchorElRowId] = React.useState(null);
  const openAction = Boolean(anchorEl);
  const [approvalPendingData, setApprovalPendingData] = useState([]);
  const [approvalRowData, setApprovalRowData] = useState({});
  const [openApprovalView, setOpenApprovalView] = useState(false);

  useEffect(() => {
    GetCIList(dispatch);
  }, []);

  const handleOpenAssessmentForm = (data) => {
    setApprovalRowData(data?.all_Data);
    setOpenApprovalView(true);
  };

  const handleCloseApprovalView = () => {
    setOpenApprovalView(false);
  };

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setAnchorElRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElRowId(null);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data:', ci_list);
        const pendingAllData = ci_list
          ?.filter((item) => item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num)
          ?.map((item, index) => ({
            id: index + 1,
            ci_no: item?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num,
            ci_date: item.opo_master?.pfi_masters[0]?.commercial_invoice?.invoice_date,
            company: item.opo_master.OprMaster.companyMaster.company_name,
            amount_type: item.amount_type,
            payment_type: item.payment_type,
            bill_no: item.bill_no,
            amount: item.amount,
            vat: item.vat,
            narration: item.narration,
            // for view
            co_ordinator_name: item.co_ordinator_name,
            pfi_no: item.pfi_no,
            inv_no: item.bl_date,
            description_of_goods: item.description_of_goods,
            unit: item.unit,
            port_of_origin: item.port_of_origin,
            vessel: item.vessel,
            revised_eta_date: item.revised_eta_date,
            no_of_container_size: item.no_of_container_size,
            gross_weight_cbm: item.gross_weight_cbm,
            cfr_amount: item.cfr_amount,
            remittance_terms: item.remittance_terms,
            awb_number: item.awb_number,
            form_m_no: item.form_m_no,
            sender: item.sender,
            eta: item.eta,
            c_no: item.c_no,
            free_days: item.free_days,
            port_of_destination: item.port_of_destination,
            all_Data: item
          }));
        setApprovalPendingData(pendingAllData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  const pendingColumn = [
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
            {/* <MenuItem
              onClick={() => {
                onCreateCIClick(params.row);
                handleClose();
              }}
            >
              <strong>View Doc</strong>
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate('/logistics/insurance');
              }}
            >
              <strong>Download</strong>
            </MenuItem> */}

            <MenuItem>
              <Link
                component="button"
                onClick={() => {
                  handleClose();
                  handleOpenAssessmentForm(params.row);
                }}
              >
                <strong>View Doc</strong>
              </Link>
            </MenuItem>
          </Menu>
        </div>
      ),
      flex: 0.4
    },
    {
      field: 'ci_no',
      headerName: 'CI No.',
      // renderCell: (params) => (
      //   <Link component="button" onClick={() => handleRfqIdClick(params.value)}>
      //     {params.value}
      //   </Link>
      // )
      flex: 1
    },

    { headerName: 'CI Date', field: 'ci_date', flex: 1 },
    { headerName: 'Company', field: 'company', flex: 1 },
    { headerName: 'Amount Type', field: 'amount_type', flex: 1 },
    { headerName: 'Payment Type', field: 'payment_type', flex: 1 },
    { headerName: 'Bill No', field: 'bill_no', flex: 1 },
    { headerName: 'Bill Date', field: 'bill_date', flex: 1 },
    { headerName: 'Amount', field: 'amount', flex: 1 },
    { headerName: 'VAT', field: 'vat', flex: 1 },
    { headerName: 'Narration', field: 'narration', flex: 1 }
  ];

  return (
    <div>
      <MainCard
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {openApprovalView ? <span>Job Card</span> : <span>Job Card</span>}
            {openApprovalView && (
              <span>
                <PlusButton label="Back" onClick={handleCloseApprovalView} />
              </span>
            )}
          </Box>
        }
      >
        <div>
          {openApprovalView ? (
            <ApprovalView approvalViewData={approvalRowData} />
          ) : (
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
              rows={approvalPendingData}
              columns={pendingColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // loading={isFetching}
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          )}
        </div>
      </MainCard>
    </div>
  );
};

export default ApprovalPending;
