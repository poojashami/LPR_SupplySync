import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';

import PlusButton from 'components/CustomButton';
import RFQForm from './rfqForm';
import RFQTable from './rfqTable';

const RFQPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateForm = () => {
    setShowForm(true);
  };


  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {!showForm ? <span>Format Details</span> : <span>Create Form</span>}
          {!showForm ? (
            <PlusButton label="+Create Form" onClick={handleCreateForm} />
          ) : (
            <PlusButton
              label="Back"
              onClick={() => {
                setShowForm(false);
              }}
            />
          )}
        </Box>
      }
    >
      {showForm ? <RFQForm /> : <RFQTable />}
    </MainCard>
  );
};

export default RFQPage;
