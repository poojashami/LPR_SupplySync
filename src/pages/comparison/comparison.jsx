import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import QuotationComparison from './quotaionComparison';

import '../comparison/comparison.css';

const ComparisonPage = () => {
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const handleCloseForm = () => {
    setShowQuotComPage(false);
    setSelectedRfqId(null);
    setFormMode('create');
  };

  const handleSuccessfulSubmit = () => {
    setShowQuotComPage(false);
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Quotation Comparison</span>
        </Box>
      }
    >
      <QuotationComparison
        quotation={selectedRfqId}
        onSuccessfulSubmit={handleSuccessfulSubmit}
        formMode={formMode}
        onClose={handleCloseForm}
      />
    </MainCard>
  );
};

export default ComparisonPage;
