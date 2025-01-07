import MainCard from 'components/MainCard';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import { Typography, Button, Chip, Dialog, AppBar, Box, Toolbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailView from 'pages/email/emailView';
import SendIcon from '@mui/icons-material/Send';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CompanyForPfi = ({ onClose, oprViewData, setCompany, setPfiDataToShow, setPfi }) => {
  const [companyList, setCompanyList] = useState([]);
  const [open, setOpen] = useState(false);
  const [showData, setShowData] = useState({});

  const getData = async () => {
    const { data } = await axiosInstance.get(`api/pfi/pfibypoid?po_id=${oprViewData.po_id}`);
    const mappedData = data?.map((item, index) => ({
      status: item.status,
      id: index + 1,
      name: item.company_name,
      companyId: item.company_id,
      pfi_id: item.pfi_id
    }));
    setCompanyList(mappedData);
  };
  useEffect(() => {
    getData();
  }, []);
  const handlePfiPO = (company) => {
    setCompany({ ...company });
    setPfi(companyList.filter((companyOn) => companyOn.id === company.id));
  };
  const viewPfiHandler = (e) => {
    setShowData((val) => ({ ...val, ['companyData']: { ...e } }));
    setOpen(true);
  };
  const companyTableHeader = [
    { field: 'id', headerName: 'S.NO', width: 100 },
    { field: 'name', headerName: 'Company Name', width: 180 },
    { field: 'companyId', headerName: 'Company Id', width: 100 },
    {
      field: 'status',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => {
        // if (params.row.status === '1' || params.row.status === 1) {
        if (true) {
          return (
            <Button variant="text" style={{ color: 'blue' }} onClick={() => handlePfiPO(params.row)}>
              <Chip
                sx={{
                  color: 'black',
                  ':hover': {
                    color: 'white'
                  }
                }}
                variant="outlined"
                label="Create PFI"
              />
            </Button>
          );
        } else
          return (
            <Button
              variant="text"
              style={{ color: 'blue' }}
              onClick={() => {
                setPfiDataToShow({ id: '' });
                setPfi(companyList.filter((companyOn) => companyOn.id === params.row.id));
              }}
            >
              <Chip
                sx={{
                  color: 'black',
                  ':hover': {
                    color: 'white'
                  }
                }}
                variant="outlined"
                label="View PFI"
              />
            </Button>
          );
      }
    }
  ];

  return (
    <MainCard title={`Create PFI for PO number: ${oprViewData.po_number}`}>
      <div style={{ marginTop: '30px' }}>
        <DataGrid
          getRowHeight={() => 'auto'}
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
          }}
          rows={companyList}
          columns={companyTableHeader}
          pagination={false}
          hideFooterPagination
        />
      </div>
      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end' }}>
        <Button
          variant="contained"
          onClick={() => {
            setPfiDataToShow(null);
            onClose();
          }}
          sx={{ ml: 2 }}
        >
          Close
        </Button>
      </div>
      <Dialog TransitionComponent={Transition} fullScreen open={open} onClose={() => setOpen((preVal) => !preVal)}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpen((preVal) => !preVal)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              PFI for {oprViewData?.po_number}, Company {showData?.companyData?.name}
            </Typography>
            <Button
              variant="contained"
              //  onClick={mailHandler}
              endIcon={<SendIcon />}
              onClick={() => setOpen((preVal) => !preVal)}
            >
              Send via Mail
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4 }}>
          <EmailView />
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default CompanyForPfi;
