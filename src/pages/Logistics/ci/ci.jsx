import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import PlusButton from 'components/CustomButton';

import CIForm from './ciForm';
import CIView from './ciView';
import CITable from './ciTable';

const CIPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPiNo, setSelectedPiNo] = useState(null);

  const handleCreateForm = () => {
    setShowForm(true);
    setSelectedPiNo(null);
  };

  const handleBackToTable = () => {
    setShowForm(false);
    setSelectedPiNo(null);
  };

  const handlePiNoClick = (piNo) => {
    console.log('PI No Clicked:', piNo); // Debugging: Check if this logs the correct PI No
    setSelectedPiNo(piNo);
    setShowForm(false);
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {!showForm && !selectedPiNo ? (
            <span>CI Details</span>
          ) : selectedPiNo ? (
            <span>CI View: {selectedPiNo}</span>
          ) : (
            <span>Create CI</span>
          )}
          {!showForm && !selectedPiNo ? (
            <PlusButton label="+ Create CI" onClick={handleCreateForm} />
          ) : (
            <PlusButton label="Back" onClick={handleBackToTable} />
          )}
        </Box>
      }
    >
      {showForm ? <CIForm /> : selectedPiNo ? <CIView piNo={selectedPiNo} /> : <CITable onPiNoClick={handlePiNoClick} />}
    </MainCard>
  );
};

export default CIPage;
