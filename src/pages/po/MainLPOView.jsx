import { Box, Button, Grid, Typography, TextField, Table, TableRow, TableHead, TableCell, IconButton } from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import CancelButton from 'components/CustomCancelButton';
import LPOBasicDetail from './LPOBasicDetail';
import LPRDetail from './LPRDetail';
import RequireDocuments from './RequireDocuments';
import ApprovalPaymentQuotaDetail from './ApprovalPaymentQuotaDetail';
import LPOItemDetail from './LPOItemDetail';
import LpoAmountBackup from './LpoAmountBackup';
import SubmitButton from 'components/CustomSubmitBtn';
import { useNavigate } from 'react-router-dom';

const MainLPOView = () => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetail: true,
    oprDetail: true,
    additinalCost: true,
    ApprovalDetails: true,
    BreakupAmountDetails: true,
    itemDetails: true
  });
  const navigate = useNavigate();
  const handleOpenDoc = () => {
    navigate('/po/lpo_doc'); // Opens in a new tab
  };
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
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
  const accept = async (desc) => {
    setIsApproved(desc);
  };

  return (
    <Box>
      Card
      <Table>{renderTableHeader('basicDetail', 'Basic Details')}</Table>
      {showTableHeading.basicDetail && <LPOBasicDetail />}
      {/* ----------------------------------------------------------------------- */}
      <Table>{renderTableHeader('oprDetail', 'LPR Details')}</Table>
      {showTableHeading.oprDetail && <LPRDetail />}
      {/* ----------------------------------------------------------------------- */}
      <Table>{renderTableHeader('additinalCost', 'Require Documents, Additional Charges & Quotation Documents')}</Table>
      {showTableHeading.additinalCost && <RequireDocuments />}
      <Table sx={{ marginTop: '20px' }}>
        {renderTableHeader('ApprovalDetails', 'Approval, Quotation Details & Payment Details')}
        {showTableHeading.ApprovalDetails && <ApprovalPaymentQuotaDetail />}
      </Table>
      <Table sx={{ marginTop: '30px' }}> {renderTableHeader('BreakupAmountDetails', 'LPO Amount Breakup')}</Table>
      {showTableHeading.BreakupAmountDetails && <LpoAmountBackup />}
      <Table>{renderTableHeader('itemDetails', 'Items Details')}</Table>
      {showTableHeading.itemDetails && <LPOItemDetail />}
      <Box padding={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography color={'navy'} fontSize={'13px'} fontWeight={600}>
              LPO Approval
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography variant="body1" sx={{ color: 'navy' }} marginBottom={'10px'}>
              Approval of PO{' '}
              <span className="text-primary" style={{ color: 'blue' }}>
                #LPO73676
              </span>
            </Typography>

            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle2" style={{ fontSize: '11px' }}>
                Remarks
              </Typography>
              <TextField
                fullWidth
                id="remarks"
                value={comment}
                variant="outlined"
                onChange={(e) => setComment(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '4px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end', paddingTop: '10px' }}>
                <CancelButton onClick={() => accept(false)}>Cancel</CancelButton>

                <Button
                  size="small"
                  sx={{
                    backgroundColor: '#2c6095',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#244b78'
                    },
                    ml: 2
                  }}
                  onClick={() => {
                    if (comment.trim() !== '') {
                      accept(true);
                      setIsApproved(true);
                      // setApprovalPOOpen(true);
                    }
                  }}
                >
                  Send for Approval
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="center" mt={2} gap={2}>
        <SubmitButton
          disabled={loading}
          variant="contained"
          onClick={handleOpenDoc}
          // endIcon={loading ? <CircularProgress size={'large'} sx={{ color: 'primary' }} /> : <SendIcon />}
        >
          Send via Mail
        </SubmitButton>
        <SubmitButton
          disabled={loading}
          variant="contained"
          // onClick={handleOpenDoc}
          // endIcon={loading ? <CircularProgress size={'large'} sx={{ color: 'primary' }} /> : <SendIcon />}
        >
          Attach LPO Acceptance Copy
        </SubmitButton>
        <SubmitButton
          disabled={loading}
          variant="contained"
          // onClick={handleOpenDoc}
          // endIcon={loading ? <CircularProgress size={'large'} sx={{ color: 'primary' }} /> : <SendIcon />}
        >
          Request for Payment
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default MainLPOView;
