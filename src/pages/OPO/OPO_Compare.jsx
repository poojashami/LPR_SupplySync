import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import QuotationComparison from './quoteCompareTabulation';
import { useSelector } from 'react-redux';
import '../comparison/comparison.css';

const QuoteCompare = () => {
  const { compareMode } = useSelector((state) => state.static);
  console.log(compareMode);
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const handleCloseForm = () => {
    // setShowQuotComPage(false);
    setSelectedRfqId(null);
    setFormMode('create');
  };

  const handleSuccessfulSubmit = () => {
    // setShowQuotComPage(false);
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Quotes For Company: {compareMode.company_id} & OPR ID: {compareMode.opr_num}
        </Box>
      }
    >
      <QuotationComparison
        quotation={selectedRfqId}
        onSuccessfulSubmit={handleSuccessfulSubmit}
        formMode={formMode}
        onClose={handleCloseForm}
        compareMode={compareMode}
      />
    </MainCard>
  );
};

export default QuoteCompare;
