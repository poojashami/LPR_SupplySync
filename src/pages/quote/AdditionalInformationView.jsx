import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox, Typography, Table, TableRow, TableHead, TableCell, IconButton, Grid, TextField, Button } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const AdditionalInformationView = () => {
  const [showLPRForm, setShowLPRForm] = useState(false);
  const [remark, setRemark] = useState('');
  const [showTableHeading, setShowTableHeading] = useState({
    viewLPR: true,
    lprForm: true,
    approvedlpr: true,
    heading3: true
  });
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const handleChange = (event) => {
    setRemark(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the remark submission
    console.log('Remark Submitted:', remark);
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0, paddingLeft: '8px !important' }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={'14px'} fontWeight={600} textTransform={'none'}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  const rfqDocListColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'rfq_req_doc_master_name', headerName: 'Document Name', width: 300 , flex:1}
  ];
  const rfqDocListData = [
    { id: 1, rfq_req_doc_master_name: 'Technical Specification Document' },
    { id: 2, rfq_req_doc_master_name: 'Quality Certification Document' },
    { id: 3, rfq_req_doc_master_name: 'Project Timeline and Milestones' },
    { id: 4, rfq_req_doc_master_name: 'Financial Proposal' },
    { id: 5, rfq_req_doc_master_name: 'Vendor Compliance Certificate' },
    { id: 6, rfq_req_doc_master_name: 'Environmental Impact Assessment' },
    { id: 7, rfq_req_doc_master_name: 'Workforce Safety Plan' }
  ];

  const remarksHeader = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'created_by', headerName: 'Created By', width: 120 },
    { field: 'created_on', headerName: 'Created On', width: 120 },
    // { field: 'created_at', headerName: 'Created At', width: 120 },
    { field: 'remarks', headerName: 'Remarks', flex: 1 }
  ];
  const remarksData = [
    {
      id: 1,
      created_by: 'John Doe',
      created_on: '2025-01-01',
      remarks: 'Initial setup of the project completed successfully.'
    },
    {
      id: 2,
      created_by: 'Jane Smith',
      created_on: '2025-01-02',
      remarks: 'Reviewed project requirements and added necessary changes.'
    },
    {
      id: 3,
      created_by: 'Michael Brown',
      created_on: '2025-01-03',
      remarks: 'Technical specifications verified and approved.'
    }
  ];

  return (
    <Box>
      <Table>{renderTableHeader('approvedlpr', 'Approval Details')}</Table>
      {showTableHeading.approvedlpr && (
        <>
          <Box padding={1}>
            <Grid container spacing={2}>
              {/* First DataGrid */}
              <Grid item xs={12} md={6}>
                <Box color={'navy'} fontWeight={'600'} fontSize={'13px'}>
                  Required Documents
                </Box>
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      border: '1px solid rgba(224, 224, 224, 1)',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: '#f5f5f5',
                      border: '1px solid rgba(224, 224, 224, 1)',
                      height: '25px !important',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiCheckbox-root': {
                      padding: 0,
                      margin: '0 auto', // Center align the checkbox
                      width: '18px',
                      height: '18px'
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px'
                    },
                    '& .MuiDataGrid-scrollbar': {
                      height: '8px'
                    }
                  }}
                  rows={rfqDocListData}
                  columns={rfqDocListColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  hideFooter
                  hideFooterPagination
                  hideFooterSelectedRowCount
                />
              </Grid>

              {/* Second DataGrid */}
              <Grid item xs={12} md={6}>
                <Box color={'navy'} fontWeight={'600'} fontSize={'13px'}>
                  Additional Remarks
                </Box>
                <DataGrid
                  getRowHeight={() => 'auto'}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      border: '1px solid rgba(224, 224, 224, 1)',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: '#f5f5f5',
                      border: '1px solid rgba(224, 224, 224, 1)',
                      height: '25px !important',
                      display: 'flex',
                      alignItems: 'center'
                    },
                    '& .MuiDataGrid-scrollbar': {
                      height: '8px'
                    }
                  }}
                  rows={remarksData}
                  columns={remarksHeader}
                  hideFooter
                  hideFooterPagination
                  hideFooterSelectedRowCount
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdditionalInformationView;
